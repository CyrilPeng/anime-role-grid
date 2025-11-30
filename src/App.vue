<script setup lang="ts">
import { ref, computed } from 'vue'
// import html2canvas from 'html2canvas'
import Header from '~/components/Header.vue'
import Grid from '~/components/Grid.vue'
import Search from '~/components/Search.vue'
import Footer from '~/components/Footer.vue'
import { list, name, currentTemplateId } from '~/logic/storage'
import { TEMPLATES } from '~/logic/templates'
import type { GridItemCharacter } from '~/types'

const showSearch = ref(false)
const currentSlotIndex = ref<number | null>(null)

const currentTemplate = computed(() => 
  TEMPLATES.find(t => t.id === currentTemplateId.value) || TEMPLATES[0]!
)

function handleSelectSlot(index: number) {
  currentSlotIndex.value = index
  showSearch.value = true
}

function handleAdd(character: GridItemCharacter) {
  const index = currentSlotIndex.value
  if (index === null) return
  
  const item = list.value[index]
  if (!item) return

  // Update the character in the selected slot
  item.character = character
  
  // Close search
  showSearch.value = false
  currentSlotIndex.value = null
}

const saving = ref(false)

async function handleSave() {
  const element = document.getElementById('grid-capture-target')
  if (!element || saving.value) return
  
  saving.value = true
  
  // Store original srcs to restore later
  const images = Array.from(element.getElementsByTagName('img'))
  const originalSrcs = images.map(img => img.src)
  
  try {
    // Dynamic import to prevent page load crashes
    let toPng
    try {
      const module = await import('html-to-image')
      toPng = module.toPng
    } catch (e) {
      console.error('Failed to load html-to-image:', e)
      alert('组件加载失败，请尝试重启开发服务器 (npm run dev)')
      return
    }

    // Pre-process images: Fetch and convert to Base64
    // This is CRITICAL for html-to-image to work with cross-origin images reliably
    await Promise.all(images.map(async (img) => {
      try {
        // Skip if already base64
        if (img.src.startsWith('data:')) return

        const response = await fetch(img.src, { cache: 'force-cache' })
        const blob = await response.blob()
        return new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            img.removeAttribute('crossorigin') // Remove crossorigin for Base64
            img.src = (reader.result as string) || ''
            resolve()
          }
          reader.readAsDataURL(blob)
        })
      } catch (e) {
        console.warn('Failed to convert image:', img.src, e)
      }
    }))

    // Wait a bit for DOM to update
    await new Promise(resolve => setTimeout(resolve, 100))

    // Calculate target width for high-res desktop view
    const currentCols = currentTemplate.value.cols
    // 120px per column. 
    // We force the container to this width during capture.
    const targetWidth = currentCols * 120
    
    // Use html-to-image which uses SVG foreignObject
    // This supports oklch and modern CSS natively.
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 3, // High resolution
      cacheBust: true,
      width: targetWidth,
      // Force the element to layout at desktop size
      style: {
        width: `${targetWidth}px`,
        maxWidth: 'none',
        height: 'auto',
        transform: 'none',
        margin: '0',
        // Ensure grid layout uses fixed px columns instead of minmax(0, 1fr)
        gridTemplateColumns: `repeat(${currentCols}, 120px)`,
      }
    })
    
    const link = document.createElement('a')
    link.download = `anime-grid-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (error: any) {
    console.error('Export failed:', error)
    alert(`图片生成失败: ${error.message || error}`)
  } finally {
    // Restore original images
    images.forEach((img, i) => {
      img.setAttribute('crossorigin', 'anonymous') // Restore crossorigin
      img.src = originalSrcs[i] || ''
    })
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans pb-20">
    <!-- Header no longer needs search event, as search is triggered by grid slots -->
    <Header v-model:name="name" @search="() => {}" />
    
    <div class="container mx-auto flex flex-col items-center gap-6 px-4 max-w-full overflow-x-hidden">
      <Grid 
        :list="list" 
        :cols="currentTemplate.cols"
        @select-slot="handleSelectSlot"
      />

      <div class="flex flex-col items-center gap-4">
        <button 
          class="px-8 py-3 bg-gray-900 text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
          :disabled="saving"
          @click="handleSave"
        >
          <div v-if="saving" i-carbon-circle-dash class="animate-spin text-xl" />
          <div v-else i-carbon-image class="text-xl" />
          <span>{{ saving ? '生成中...' : '保存高清图片' }}</span>
        </button>

        <!-- Template Switcher (Dropdown) -->
        <div class="flex items-center gap-2">
          <label for="template-select" class="text-sm text-gray-500 dark:text-gray-400">当前模板:</label>
          <div class="relative">
            <select
              id="template-select"
              v-model="currentTemplateId"
              class="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-1 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option v-for="template in TEMPLATES" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <div i-carbon-chevron-down class="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showSearch" 
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" 
        @click="showSearch = false" 
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-10 opacity-0"
    >
      <Search
        v-if="showSearch"
        class="fixed left-1/2 top-20 z-50 -translate-x-1/2 w-[90%] max-w-5xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
        @add="handleAdd"
        @close="showSearch = false"
      />
    </Transition>
  </div>
</template>
