<script setup lang="ts">
import { ref, shallowRef, onMounted, watch } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { useBgmSearch } from '~/logic/search'
import type { BgmCharacterSearchResultItem } from '~/types'

const emit = defineEmits(['add', 'close'])

const input = ref<HTMLInputElement>()
const keyword = ref('')
const searchResult = shallowRef<BgmCharacterSearchResultItem[]>([])
const loading = ref(false)
const errorMessage = ref('')
const offset = ref(0)
const hasMore = ref(true)

const activeTab = ref<'search' | 'custom'>('search') // New: Active tab state

// New: Custom upload form states
const customName = ref('')
const customImageFile = ref<File | null>(null)
const customImagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const { escape } = useMagicKeys()
if (escape) {
  watch(escape, (v) => {
    if (v) emit('close')
  })
}

async function handleSearch() {
  if (!keyword.value) return
  loading.value = true
  errorMessage.value = ''
  searchResult.value = []
  offset.value = 0
  hasMore.value = true
  
  try {
    const results = await useBgmSearch(keyword.value, 0)
    searchResult.value = results
    if (results.length < 20) hasMore.value = false
  } catch (e: any) {
    errorMessage.value = e.message
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  offset.value += 20
  
  try {
    const results = await useBgmSearch(keyword.value, offset.value)
    if (results.length > 0) {
      searchResult.value = [...searchResult.value, ...results]
      if (results.length < 20) hasMore.value = false
    } else {
      hasMore.value = false
    }
  } catch (e: any) {
    errorMessage.value = e.message
  } finally {
    loading.value = false
  }
}

function handleAdd(item: BgmCharacterSearchResultItem) {
  emit('add', {
    id: item.id,
    name: item.name,
    image: item.images.large, // 关键：将角色的大图URL传递给父组件
  })
  emit('close')
}

// New: Custom upload functions
function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    customImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      customImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    customImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      customImagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

function handleCustomAdd() {
  if (customName.value && customImagePreview.value) {
    emit('add', {
      id: `custom-${Date.now()}`, // Generate a unique ID for custom items
      name: customName.value,
      image: customImagePreview.value,
    })
    emit('close')
  }
}

onMounted(() => {
  input.value?.focus()
})
</script>

<template>
  <div class="flex flex-col gap-4 p-6 h-full">
    <div class="relative shrink-0">
      <input
        ref="input"
        v-model="keyword"
        class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="搜索角色..."
        type="text"
        @keydown.enter="handleSearch"
      >
      <div 
        class="absolute right-3 top-1/2 -translate-y-1/2 text-xl p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        @click="handleSearch"
      >
        <div v-if="loading" i-carbon-circle-dash class="animate-spin text-blue-500" />
        <div v-else i-carbon-search />
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- Tabs -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button 
          class="flex-1 py-2 text-sm font-medium transition-colors relative"
          :class="activeTab === 'search' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
          @click="activeTab = 'search'"
        >
          搜索角色
          <div v-if="activeTab === 'search'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
        </button>
        <button 
          class="flex-1 py-2 text-sm font-medium transition-colors relative"
          :class="activeTab === 'custom' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'"
          @click="activeTab = 'custom'"
        >
          自定义上传
          <div v-if="activeTab === 'custom'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
        </button>
      </div>

      <!-- Search Tab Content -->
      <div v-if="activeTab === 'search'">
        <div v-if="searchResult.length" class="columns-2 md:columns-3 lg:columns-4 gap-4 pb-4 space-y-4">
          <div
            v-for="item in searchResult"
            :key="item.id"
            class="break-inside-avoid group flex flex-col gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="handleAdd(item)"
          >
            <div class="w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 relative">
              <img 
                :src="item.images?.large || item.images?.medium || item.images?.grid" 
                class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              >
            </div>
            <p class="w-full text-center text-sm font-medium px-1" :title="item.name">
              {{ item.name }}
            </p>
          </div>
        </div>
        
        <!-- Load More Button -->
        <div v-if="searchResult.length && hasMore" class="flex justify-center pb-6">
          <button 
            class="px-6 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
            :disabled="loading"
            @click="loadMore"
          >
            <div v-if="loading" i-carbon-circle-dash class="animate-spin" />
            <span>{{ loading ? '加载中...' : '加载更多' }}</span>
          </button>
        </div>

        <div v-else-if="errorMessage" class="flex flex-col items-center justify-center h-64 text-red-500 px-4 text-center">
          <div i-carbon-warning-filled class="text-4xl mb-2" />
          <p>{{ errorMessage }}</p>
        </div>
        <div v-else-if="keyword && !loading" class="flex flex-col items-center justify-center h-64 text-gray-400">
          <div i-carbon-search class="text-4xl mb-2" />
          <p>未找到相关角色</p>
        </div>
      </div>

      <!-- Custom Upload Tab Content -->
      <div v-else class="p-4 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">角色名称</label>
          <input 
            v-model="customName"
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
            placeholder="输入角色名字"
          >
        </div>
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">上传图片</label>
          <div 
            class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative"
            @click="triggerFileInput"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              class="hidden"
              @change="handleFileChange"
            >
            <div v-if="customImagePreview" class="w-32 h-auto mb-2">
              <img :src="customImagePreview" class="w-full h-full object-cover rounded-lg shadow-md">
            </div>
            <div v-else i-carbon-image class="text-4xl text-gray-400 mb-2" />
            <p class="text-sm text-gray-500">{{ customImagePreview ? '点击更换图片' : '点击或拖拽上传图片' }}</p>
          </div>
        </div>

        <button 
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          :disabled="!customName || !customImagePreview"
          @click="handleCustomAdd"
        >
          确认添加
        </button>
      </div>
    </div>
  </div>
</template>
