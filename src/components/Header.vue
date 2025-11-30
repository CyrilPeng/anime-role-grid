<script setup lang="ts">
import html2canvas from 'html2canvas'
import { ref } from 'vue'

defineProps<{
  name: string
}>()

const emit = defineEmits(['update:name', 'search'])

function handleInput(e: Event) {
  emit('update:name', (e.target as HTMLInputElement).value)
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
    // Pre-process images: Fetch and convert to Base64
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

    const canvas = await html2canvas(element, {
      scale: 3, // High resolution
      useCORS: true, 
      backgroundColor: '#ffffff',
      logging: false,
    })
    
    const link = document.createElement('a')
    link.download = `anime-grid-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
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
  <header class="flex flex-col items-center gap-6 mb-8">
    <div class="relative group">
      <input
        :value="name"
        class="text-4xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors px-2 py-1 text-gray-800"
        type="text"
        @input="handleInput"
      >
      <div i-carbon-edit class="absolute -right-8 top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    
    <button 
      class="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
      :disabled="saving"
      @click="handleSave"
    >
      <div v-if="saving" i-carbon-circle-dash class="animate-spin" />
      <div v-else i-carbon-image />
      <span>{{ saving ? '生成中...' : '保存高清图片' }}</span>
    </button>
  </header>
</template>
