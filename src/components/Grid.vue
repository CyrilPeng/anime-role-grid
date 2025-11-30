<script setup lang="ts">
import type { GridItem } from '~/types'

defineProps<{
  list: GridItem[]
}>()

const emit = defineEmits(['select-slot'])

function handleSelect(index: number) {
  emit('select-slot', index)
}

function getProxyUrl(url: string) {
  if (!url) return ''
  // If it's a Base64 string (custom upload), return as is
  if (url.startsWith('data:')) return url
  
  // Use wsrv.nl as CORS proxy
  // Remove protocol to avoid double encoding issues sometimes, but wsrv handles full URLs fine.
  // We strip 'https:' just to be clean or pass full. wsrv expects 'url' param.
  // Example: https://wsrv.nl/?url=lain.bgm.tv/...&output=png
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png`
}
</script>

<template>
  <div class="flex justify-center p-4">
    <!-- 
      Legacy Style Grid:
      - Fixed width: 600px (120px * 5 columns)
      - Borders: Container has Top/Left, Items have Right/Bottom. This ensures consistent 2px lines everywhere.
      - No gaps
      - White background
    -->
    <div id="grid-capture-target" class="grid grid-cols-5 border-t-2 border-l-2 border-black bg-white w-[600px] mx-auto box-content" style="box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="relative w-[120px] h-[187px] border-r-2 border-b-2 border-black cursor-pointer group box-border"
        @click="handleSelect(index)"
      >
        <!-- Character Image -->
        <img 
          v-if="item.character"
          :src="getProxyUrl(item.character.image)" 
          class="w-full h-[160px] object-cover object-top block"
          loading="lazy"
          crossorigin="anonymous"
        >
        
        <!-- Empty State Placeholder -->
        <div 
          v-else 
          class="w-full h-[160px] bg-white"
        />

        <!-- Label Area (Bottom) -->
        <div class="h-[25px] flex items-center justify-center text-center text-sm font-bold text-black bg-white border-t-2 border-black overflow-hidden px-1">
          <span class="truncate w-full">{{ item.label }}</span>
        </div>

        <!-- Character Name Overlay (Optional, only on hover or if needed) -->
        <!-- In legacy style, character name wasn't always shown, but let's keep it subtle or remove it to be strict. 
             The user said "completely copy original". Original has label at bottom. 
             If a character is selected, does it show the character name? 
             Looking at legacy code: 
             `ctx.fillText(type, left + colWidth / 2, top + rowHeight - fontHeight / 2)` -> Types are drawn at bottom.
             Images are drawn above.
             It doesn't seem to draw character name text on the canvas, just the image.
             So we will hide character name text to be strict, or maybe show it on hover title.
        -->
        
        <!-- Hover Effect -->
        <div class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the grid borders are crisp */
.grid {
  /* box-sizing: border-box; */
}
</style>
