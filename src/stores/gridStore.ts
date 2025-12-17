import { createGlobalState, useStorage } from '@vueuse/core'
import { ref, computed } from 'vue'
import type { GridItem } from '~/types/grid'
import { api } from '~/services/api'
import { TEMPLATES } from '~/logic/templates'

/**
 * Grid Store: The "Brain" of the application.
 * Manages the current grid state, whether it's an official template or a custom one.
 */
export const useGridStore = createGlobalState(() => {
    // --- State ---

    // The ID of the current template (official or custom)
    // The ID of the current template (official or custom)
    // Persisted to sessionStorage so tabs are isolated but refresh-proof
    const currentTemplateId = useStorage('anime-grid-template-id', 'classic', globalThis.sessionStorage)

    // The definitive list of items in the grid
    // We use a map { [templateId]: GridItem[] } to persist data across template switches locally
    const savedGrids = useStorage<Record<string, GridItem[]>>('anime-grid-data-v2', {})

    // --- Legacy Migration (v1 -> v2) ---
    // Detects if user has old data but no new data, and migrates it.
    const legacyGrids = useStorage<Record<string, GridItem[]>>('anime-grid-data-v1', {})
    if (Object.keys(legacyGrids.value).length > 0 && Object.keys(savedGrids.value).length === 0) {
        console.log('🔄 Migrating legacy data to v2 storage...')
        savedGrids.value = { ...legacyGrids.value }
    }

    // Current Metadata
    const currentTitle = ref('')
    const currentConfig = ref<any>(null)
    const isCustomMode = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // --- Getters ---

    const currentList = computed({
        get: () => {
            const tid = currentTemplateId.value
            // Initialize if empty
            if (!savedGrids.value[tid]) {
                savedGrids.value[tid] = []
            }
            return savedGrids.value[tid]
        },
        set: (val: GridItem[]) => {
            savedGrids.value[currentTemplateId.value] = val
        }
    })

    // --- Actions ---

    /**
     * Initialize and Load a Template
     * @param id Template ID (official or custom)
     */
    async function loadTemplate(id: string) {
        isLoading.value = true
        error.value = null
        currentTemplateId.value = id

        try {
            // 1. Check if Official
            const official = TEMPLATES.find(t => t.id === id)

            if (official) {
                isCustomMode.value = false
                currentTitle.value = official.name
                currentConfig.value = { cols: official.cols, items: official.items }

                // Merge with defaults if list is empty or partial
                const stored = savedGrids.value[id] || []
                if (stored.length !== official.items.length) {
                    // Re-initialize based on official structure protecting existing answers
                    const merged = official.items.map((label, idx) => ({
                        label,
                        character: stored[idx]?.character
                    }))
                    savedGrids.value[id] = merged
                }
            }
            else {
                // 2. Must be Custom
                isCustomMode.value = true
                try {
                    const template = await api.getTemplate(id)
                    currentTitle.value = template.title
                    currentConfig.value = template.config

                    // Init empty grid if needed
                    if (!savedGrids.value[id] || savedGrids.value[id].length === 0) {
                        savedGrids.value[id] = template.config.items.map(label => ({ label }))
                    }
                } catch (e: any) {
                    console.error('Failed to load custom template', e)
                    error.value = e.message || '加载自定义模版失败'
                }
            }
        } catch (e: any) {
            console.error('Unexpected error loading template', e)
            error.value = e.message
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Update a specific slot
     */
    function updateItem(index: number, character: any) {
        const list = [...currentList.value]
        if (list[index]) {
            list[index] = { ...list[index], character }
            currentList.value = list
        }
        // Auto-save to cloud could happen here debounced
    }

    /**
     * Save to Cloud
     */
    async function saveToCloud() {
        if (!currentTemplateId.value) return

        await api.saveGrid({
            templateId: currentTemplateId.value,
            customTitle: currentTitle.value,
            items: currentList.value
        })
    }

    return {
        // State
        currentTemplateId,
        currentTitle,
        currentConfig,
        isCustomMode,
        isLoading,
        error,
        currentList,

        // Actions
        loadTemplate,
        updateItem,
        saveToCloud
    }
})
