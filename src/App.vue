<script setup lang="ts">
import { ref } from 'vue'
import Header from '~/components/Header.vue'
import Grid from '~/components/Grid.vue'
import Search from '~/components/Search.vue'
import Footer from '~/components/Footer.vue'
import { list, name } from '~/logic/storage'
import type { GridItemCharacter } from '~/types'

const showSearch = ref(false)
const currentSlotIndex = ref<number | null>(null)

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

</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
    <!-- Header no longer needs search event, as search is triggered by grid slots -->
    <Header v-model:name="name" @search="() => {}" />
    
    <div class="container mx-auto">
      <Grid 
        :list="list" 
        @select-slot="handleSelectSlot"
      />
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
