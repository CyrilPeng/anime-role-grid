<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div 
      v-if="show" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" 
      @click="emit('close')"
    >
      <!-- Outer Container -->
      <div 
        class="bg-white dark:bg-gray-900 w-full max-w-md max-h-[85vh] rounded-2xl shadow-2xl border-4 border-black dark:border-gray-700 relative flex flex-col overflow-hidden" 
        @click.stop
      >
        <!-- Close Button -->
        <button 
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-[#e4007f] transition-colors z-20"
          @click="emit('close')"
        >
          <div class="i-carbon-close text-xl" />
        </button>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto flex-1 p-6 flex flex-col gap-6 scrollbar-hide">
          
          <!-- Welcome Image -->
          <div class="w-full flex items-center justify-center shrink-0 pt-2">
             <img 
               src="/cana4.webp" 
               class="h-32 object-contain"
               alt="Welcome"
             />
          </div>

          <!-- Title -->
          <div class="text-center shrink-0">
            <h2 class="text-xl font-bold text-[#000000] dark:text-white mb-1">
              欢迎来到
            </h2>
            <h1 class="text-3xl font-black mb-2 text-[#000000] dark:text-white tracking-widest" style="font-family: 'Noto Serif SC', serif;">
              【我推<span class="text-[#e4007f]">的</span>格子】
            </h1>
          </div>

          <!-- Content Sections -->
          <div class="space-y-5 text-sm text-gray-700 dark:text-gray-300 font-medium">

            <!-- Community (Moved Up) -->
            <div class="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-700/50 p-3 rounded-lg">
              <div class="flex gap-2 items-center mb-1 text-[#e4007f] font-bold">
                <div class="i-carbon-group text-lg" />
                <h3>加入组织</h3>
              </div>
              <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                这是一个主打 <b>青春 · 恋爱 · 校园</b> 的<br>
                <b>ACN</b> (Animation · Comic · Novel) 交流群。<br>
                现在组织创立初期，正是<b>入股好时期</b>！
              </p>
              <a 
                href="https://qm.qq.com/q/fzvxh7q4a6" 
                target="_blank"
                class="block w-full text-center py-2 bg-[#e4007f] text-white rounded-md font-bold text-xs hover:bg-[#c0006b] transition-colors flex flex-col items-center justify-center gap-0.5"
              >
                <span>点击直达</span>
                <span class="text-[10px] opacity-90 font-normal">群号: 1022516640</span>
              </a>
            </div>
            
            <!-- 1. Templates -->
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 rounded-full bg-[#e4007f] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">1</div>
              <div>
                <h3 class="font-bold text-black dark:text-white mb-1">自由切换模板</h3>
                <p>点击下方的 <span class="text-[#e4007f] font-bold">“当前模板”</span> 按钮，可以切换不同的格子布局（如 5x3, CP问卷等）。</p>
              </div>
            </div>

            <!-- 2. FAQ -->
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 rounded-full bg-[#e4007f] text-white flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5">2</div>
              <div>
                <h3 class="font-bold text-black dark:text-white mb-1">查看常见问题</h3>
                <p>遇到问题？点击 <span class="text-[#e4007f] font-bold">“食用指南 & 常见问题”</span> 可以查看详细教程。</p>
              </div>
            </div>

            <!-- 3. Browser Warning -->
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-3 rounded-lg">
              <div class="flex gap-2 items-center mb-1 text-yellow-700 dark:text-yellow-500 font-bold">
                <div class="i-carbon-warning-filled text-lg" />
                <h3>浏览器建议</h3>
              </div>
              <p class="text-xs text-yellow-800 dark:text-yellow-200/80 leading-relaxed">
                为了获得最佳体验（特别是图片保存功能），<br>
                <span class="font-bold">强烈建议不要使用 QQ、微信等软件的内置浏览器。</span><br>
                请使用 Chrome, Safari, Edge 等原生浏览器打开。
              </p>
            </div>

          </div>

          <!-- Footer Action -->
          <div class="pt-2">
            <button 
              class="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity"
              @click="emit('close')"
            >
              开始制作
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes bounce-low {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-low {
  animation: bounce-low 2s ease-in-out infinite;
}

/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
