<script setup lang="ts">
defineProps<{
  name: string
}>()

const emit = defineEmits(['update:name', 'search'])

function handleInput(e: Event) {
  emit('update:name', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <header class="flex flex-col items-center gap-4 mb-4 md:mb-8 px-4 pt-8">
    <!-- Brand Logo & Title -->
    <div class="flex flex-col md:flex-row items-center gap-3 md:gap-4">
      <img src="/logo.png" alt="Logo" class="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm" />
      <h1 
        class="text-3xl md:text-5xl font-bold text-gray-900 tracking-widest"
        style="font-family: 'Noto Serif SC', serif;"
      >
        【我推<span class="text-[#e4007f]">的</span>格子】
      </h1>
    </div>
    <div class="relative group max-w-full flex justify-center">
      <input
        :value="name"
        class="text-2xl md:text-4xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-black focus:border-[#e4007f] focus:outline-none transition-colors px-2 py-1 text-black max-w-full"
        type="text"
        @input="handleInput"
      >
      <div i-carbon-edit class="absolute -right-6 md:-right-8 top-1/2 -translate-y-1/2 text-black opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </header>
</template>
