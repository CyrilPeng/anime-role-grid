<script setup lang="ts">
import { computed } from 'vue'
import type { GridItem } from '~/types'

const props = defineProps<{
  list: GridItem[]
  cols?: number
  title?: string
  customTitle?: string
  forExport?: boolean
}>()

const emit = defineEmits(['select-slot', 'update:customTitle'])

const gridCols = computed(() => props.cols || 5)

function handleSelect(index: number) {
  emit('select-slot', index)
}

function handleTitleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:customTitle', target.value)
}

function getImageUrl(url: string) {
  if (!url) return ''
  if (props.forExport) {
    // Use proxy for export to ensure CORS headers are correct
    // wsrv.nl is reliable and fast
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`
  }
  return url
}
</script>

<template>
  <div 
    class="w-full flex flex-col items-center relative"
    :class="{ 'bg-white py-8': forExport }"
  >
    <!-- Custom User Title (Editable) -->
    <div class="relative group mb-2">
      <input
        :value="customTitle"
        class="text-3xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-black focus:border-[#e4007f] focus:outline-none transition-colors px-2 py-1 text-black w-full"
        :class="{ 'pointer-events-none border-none': forExport }"
        style="font-family: 'Noto Serif SC', serif;"
        placeholder="我的动漫人物喜好果然有问题"
        type="text"
        @input="handleTitleInput"
      >
      <div 
        v-if="!forExport"
        i-carbon-edit 
        class="absolute -right-6 top-1/2 -translate-y-1/2 text-black opacity-0 group-hover:opacity-100 transition-opacity" 
      />
    </div>

    <!-- Template Title -->
    <h2 
      v-if="title"
      class="text-xl font-bold text-[#e4007f] mb-4 tracking-widest"
      style="font-family: 'Noto Serif SC', serif;"
    >
      — {{ title }} —
    </h2>

    <!-- 
      Responsive Grid:
      - w-full with max-w to ensure it doesn't get too wide on desktop
      - aspect-ratio ensures cells maintain shape
      - text scales with breakpoints
    -->
    <div 
      id="grid-capture-target" 
      class="grid border-t-2 border-l-2 border-black bg-white mx-auto box-content"
      :style="{ 
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        width: '100%',
        maxWidth: `${gridCols * 120}px`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="relative border-r-2 border-b-2 border-black cursor-pointer group box-border flex flex-col"
        style="aspect-ratio: 120/187;"
        @click="handleSelect(index)"
      >
        <!-- Character Image -->
        <!-- flex-grow ensures image takes available space minus label -->
        <div class="flex-grow w-full relative overflow-hidden">
          <img 
            v-if="item.character"
            :src="getImageUrl(item.character.image)" 
            class="absolute inset-0 w-full h-full object-cover object-top"
            :loading="forExport ? 'eager' : 'lazy'"
            :crossorigin="forExport ? 'anonymous' : undefined"
          >
          <!-- Empty State Placeholder -->
          <div v-else class="absolute inset-0 bg-white" />
        </div>

        <!-- Label Area (Bottom) -->
        <div class="h-[20px] md:h-[25px] flex-shrink-0 flex items-center justify-center text-center bg-white border-t-2 border-black overflow-hidden px-1">
          <span class="truncate w-full text-[10px] md:text-sm font-bold text-black leading-none">{{ item.label }}</span>
        </div>
        
        <!-- Hover Effect -->
        <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
    <!-- Watermark for Export -->
    <div 
      v-if="forExport" 
      class="absolute bottom-1 right-4 flex items-center gap-1 pointer-events-none"
    >
      <span 
        class="text-black text-sm font-bold tracking-widest" 
        style="font-family: 'Noto Serif SC', 'FZQingKeBenYueSong', 'FangSong', serif;"
      >
        【我推<span style="color: #e4007f;">的</span>格子】
      </span>
      <img src="/logo.png" class="w-6 h-6 object-contain" />
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for cleaner look if desired, but keeping it is better for usability */
</style>
