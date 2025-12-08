<script setup lang="ts">
import { ref } from 'vue'


defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

const changelogs = ref([
 {
    date: '2025.12.08',
    isOpen: true,
    items: [
      { tag: 'NEW', type: 'new', content: '<b>标签自由修改</b>：点击格子上的标签文字，即可自定义修改！' },
      { tag: 'NEW', type: 'new', content: '<b>人物/音乐搜索</b>：搜索全面升级，支持搜声优、歌手' },
      { tag: 'UP', type: 'up', content: '<b>20+ 新模版</b>：声优梗图、特摄、我的歌单、痛包展示... 等你来玩！' },
      { tag: 'FX', type: 'opt', content: '<b>视频导出修复</b>：现在视频也会正确显示你修改后的标签啦。' }
    ]
  },
  {
    date: '2025.12.07',
    isOpen: false,
    items: [
      { tag: 'NEW', type: 'new', content: '<b>全新搜索升级</b>：动漫、漫画、游戏、小说... ACG全领域一网打尽！' },
      { tag: 'NEW', type: 'new', content: '<b>2025年度模版</b>：新增年度动画/游戏专属盘点，记录你的2025。' },
      { tag: 'NEW', type: 'new', content: '<b>懒人极简模式</b>：新增 1x1 真神 / 2x2 四大天王等懒人模版。' },
      { tag: 'UP', type: 'up', content: '<b>模版大扩充</b>：新增 败犬/妹妹/RPG 等数十款趣味合集。' }
    ]
  },
  {
    date: '2025.12.06',
    isOpen: false,
    items: [
      { tag: 'NEW', type: 'new', content: '<b>视频导出功能 (Beta)</b> 上线！支持生成酷炫的动态视频。' },
      { tag: 'NEW', type: 'new', content: '支持<b>自定义上传图片命名</b>，修复长名字显示问题。' },
      { tag: 'OPT', type: 'opt', content: '优化水印样式与间距，整体视觉更协调。' }
    ]
  }
]) // Default open for visibility
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
        class="bg-white dark:bg-gray-900 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl border-4 border-black dark:border-gray-700 relative flex flex-col overflow-hidden" 
        @click.stop
      >
        <!-- Close Button -->
        <button 
          class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-[#e4007f] transition-colors z-20"
          @click="emit('close')"
        >
          <div class="i-carbon-close text-xl" />
        </button>

        <!-- Scrollable Content -->
        <div class="overflow-y-auto flex-1 p-5 flex flex-col gap-4 scrollbar-hide">
          
          <!-- Compact Header -->
          <div class="text-center shrink-0 mt-2">
            <h1 class="text-2xl font-black text-[#000000] dark:text-white tracking-widest" style="font-family: 'Noto Serif SC', serif;">
              【我推<span class="text-[#e4007f]">的</span>格子】
            </h1>
          </div>

          <!-- Content Sections -->
          <div class="space-y-4 text-sm text-gray-700 dark:text-gray-300 font-medium">

            <!-- Main Group Card (Exclusive for Guide) -->
            <a href="https://qun.qq.com/universal-share/share?ac=1&authKey=axd5YDW0i5ZiyX8jTultFRVHCHv9FAsCnqHq40itBLuQEoUOdCo06bAh05W%2Bv1c7&busi_data=eyJncm91cENvZGUiOiIxMDU1NTkxMDY0IiwidG9rZW4iOiJMazMxZ1pPZHdQejMyS1BaSFZ2UkJIdHp5b29NbTI4VU9NaGhSSW96T0NpcS9ha0oyZzJEVmpPRXZ1Nit2eTVNIiwidWluIjoiMTkxNjY0NzYxNiJ9&data=Tsay2nkLgPoS1UGFPbFnpdAsQeLPgFErKFco7mYPmWPldhqQme_u6smVnM0ifq8X5nO5TiLUbxgl57S9deOLIw&svctype=4&tempid=h5_group_info" 
               target="_blank" 
               class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-800 border-2 border-pink-100 hover:border-[#e4007f] transition-all duration-300 shadow-sm hover:shadow-md p-4 flex items-center gap-4"
            >
                <div class="bg-white dark:bg-pink-900/30 p-3 rounded-full text-[#e4007f] shadow-sm border border-pink-50 dark:border-pink-800/30 group-hover:scale-110 transition-transform duration-300">
                    <div class="i-carbon-chat text-2xl" />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-0.5">
                     <span class="font-black text-base text-gray-900 dark:text-gray-100">加入综合交流大群</span>
                     <span class="text-[10px] bg-[#e4007f] text-white px-1.5 py-0.5 rounded text-xs font-bold">推荐</span>
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">分享作品 / 寻找同好 / 反馈建议</div>
                </div>
                <div class="i-carbon-arrow-right text-xl text-gray-300 group-hover:text-[#e4007f] group-hover:translate-x-1 transition-all" />
            </a>

            <!-- Action Buttons Row -->
            <div class="flex items-center gap-3 pt-2">
                <!-- GitHub Star -->
                <a 
                  href="https://github.com/ywh555hhh/anime-role-grid"
                  target="_blank"
                  class="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <div class="i-carbon-logo-github text-lg" />
                  <span>Star</span>
                </a>

                <!-- Start Making -->
                <button 
                  class="flex-[2] py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
                  @click="emit('close')"
                >
                  <div class="i-carbon-play-filled text-lg" />
                  <span>开始制作</span>
                </button>
            </div>

            <!-- Changelog (Moved to Bottom) -->
            <div class="space-y-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2">
               <div class="text-[10px] text-center text-gray-400 font-medium mb-1 flex items-center justify-center gap-1 animate-pulse">
                   <div class="i-carbon-arrow-down" />
                   <span>查看最近更新</span>
                   <div class="i-carbon-arrow-down" />
               </div>

              <div 
                v-for="(log, idx) in changelogs" 
                :key="log.date"
                class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                  <button 
                    @click="log.isOpen = !log.isOpen"
                    class="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-xs">
                      <div :class="idx === 0 ? 'text-[#e4007f]' : 'text-gray-400'" class="i-carbon-bullhorn" />
                      <span>{{ log.date }}</span>
                    </div>
                    <div 
                      class="i-carbon-chevron-down text-gray-400 transition-transform duration-200 text-xs"
                      :class="{ '-rotate-180': log.isOpen }"
                    />
                  </button>
                  
                  <div 
                      v-show="log.isOpen"
                      class="p-3 bg-white dark:bg-gray-900/50 text-[10px] space-y-2 border-t border-gray-100 dark:border-gray-800"
                  >
                      <div v-for="(item, i) in log.items" :key="i" class="flex gap-1.5 items-start leading-relaxed">
                          <span 
                            class="font-bold shrink-0"
                            :class="{
                              'text-[#e4007f]': item.type === 'new',
                              'text-pink-600': item.type === 'up',
                              'text-pink-400': item.type === 'opt'
                            }"
                          >[{{ item.tag }}]</span>
                          <span v-html="item.content"></span>
                      </div>
                  </div>
              </div>
            </div>
            
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

.group-btn {
  @apply relative overflow-hidden rounded-xl p-2
  bg-white dark:bg-gray-800 
  border-2 border-transparent hover:border-[#e4007f]
  text-gray-900 dark:text-white
  shadow-sm hover:shadow-md
  transition-all duration-200 ease-out flex flex-col items-center justify-center min-h-[3rem] h-auto;
}

.group-btn:hover {
  @apply transform scale-[1.01];
}

.group-btn:active {
  @apply transform scale-[0.98];
}
</style>
