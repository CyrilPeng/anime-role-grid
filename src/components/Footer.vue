<script setup lang="ts">
import { ref } from 'vue'
import JoinGroupModal from './JoinGroupModal.vue'

const showQQModal = ref(false)
// Footer component with credits
</script>

<template>
  <footer 
    class="mt-16 pb-12 text-center text-gray-600"
    style="font-family: 'Noto Serif SC', serif;"
  >
    <!-- Social Links -->
    <div class="flex items-center justify-center gap-8 mb-8">
      <a 
        href="https://github.com/ywh555hhh/anime-role-grid" 
        target="_blank" 
        class="flex items-center gap-2 hover:text-[#e4007f] transition-colors group"
      >
        <div i-carbon-logo-github class="text-xl group-hover:scale-110 transition-transform" />
        <span class="font-bold tracking-widest">GitHub</span>
      </a>
      <a 
        href="https://discord.gg/8xF22PN4jW" 
        target="_blank" 
        class="flex items-center gap-2 hover:text-[#e4007f] transition-colors group"
      >
        <div i-carbon-logo-discord class="text-xl group-hover:scale-110 transition-transform" />
        <span class="font-bold tracking-widest">Discord</span>
      </a>
      <button 
        @click="showQQModal = true"
        class="flex items-center gap-2 hover:text-[#e4007f] transition-colors group"
      >
        <!-- Custom QQ Icon SVG -->
        <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" fill="currentColor"></path>
        </svg>
        <span class="font-bold tracking-widest">QQ Group</span>
      </button>
    </div>
    
    <JoinGroupModal :show="showQQModal" @close="showQQModal = false" />
    
    <!-- Credits -->
    <div class="space-y-4 text-sm">
      <p class="tracking-wide flex items-center justify-center gap-2">
        <span class="i-carbon-data-base text-gray-400" />
        <span>数据来源</span>
        <a href="https://bgm.tv" target="_blank" class="font-bold text-[#e4007f] hover:text-[#c0006b] transition-colors mx-1 flex items-center gap-1">
          Bangumi 番组计划
          <span class="i-carbon-favorite-filled text-xs" />
        </a>
      </p>
      
      <div class="flex items-center justify-center gap-2 text-xs opacity-80">
        <span class="i-carbon-idea text-gray-400" />
        <span>致敬灵感</span>
        <a href="https://github.com/itorr/anime-grid" target="_blank" class="hover:text-[#e4007f] transition-colors border-b border-transparent hover:border-[#e4007f] flex items-center gap-1">
          itorr/anime-grid
          <span class="i-carbon-launch text-[10px]" />
        </a>
      </div>

      <!-- Artistic Note -->
      <p class="italic opacity-60 text-xs mt-8 tracking-widest flex items-center justify-center gap-2">
        <span class="i-carbon-quotes text-gray-300" />
        Create, Share, and Discover your Anime Taste
        <span class="i-carbon-quotes text-gray-300 transform rotate-180" />
      </p>

      <!-- Disclaimer -->
      <p class="text-[10px] opacity-40 mt-2 tracking-wider flex items-center justify-center gap-1">
        <span class="i-carbon-information" />
        仅供个人娱乐使用 · 禁止用于任何商业用途
      </p>
    </div>
  </footer>
</template>
