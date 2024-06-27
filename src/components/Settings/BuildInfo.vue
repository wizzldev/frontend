<template>
  <section class="text-center text-gray-500 text-xs mt-12 pt-12 mb-5 pb-4">
    <p>
      {{ ucFirst(mode) }} <Tippy class="transition-all cursor-pointer hover:px-2 py-0.5 rounded hover:bg-secondary hover:text-gray-100" :content="hash">{{ shortHash }}</Tippy>
    </p>
    <p class="mt-0.5">
      {{ branch }} - {{ $time.format(date.getTime(), 'mini') }}
    </p>
    <LazyImage class="mx-auto w-6 h-6 rounded mt-3" alt="Wizzl Logo" :src="cdnImage('wizzl.webp', 64)" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ucFirst } from '@/scripts/ucfirst'
import { Tippy } from 'vue-tippy'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'

const hash = ref(import.meta.env.VITE_BUILD_HASH)
const shortHash = ref(import.meta.env.VITE_BUILD_HASH_SHORT)
const mode = ref(import.meta.env.MODE)
const date = ref(new Date(import.meta.env.VITE_BUILD_DATE))
const branch = ref(import.meta.env.VITE_BRANCH)
</script>