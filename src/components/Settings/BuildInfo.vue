<template>
  <section class="text-center text-gray-500 text-xs pt-5 mb-5 pb-4">
    <p>
      {{ ucFirst(mode) }}
      {{ shortHash }}
    </p>
    <p class="mt-0.5">{{ branch }} - {{ $time.format(date.getTime(), 'mini') }}</p>
    <LazyImage
      class="mx-auto w-6 h-6 rounded mt-3"
      alt="Wizzl Logo"
      :src="cdnImage('wizzl.webp', 64)"
    />
    <div class="flex items-center space-x-2 justify-center mt-4">
      <InAppLink v-for="link in links" :key="link.url" :title="ucFirst(link.title)" :href="link.url" target="_blank" class="transition-colors text-gray-400 hover:text-gray-500 focus:text-gray-600 visited:text-purple-400">
        <component :is="link.icon" :class="{'!w-4 !h-4': link.title != 'x', '!w-3 !h-3': link.title == 'x'}" />
      </InAppLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ucFirst } from '@/scripts/ucfirst'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import Discord from '@/components/Icons/Brands/Discord.vue'
import InAppLink from '@/components/InAppLink.vue'
import Instagram from '@/components/Icons/Brands/Instagram.vue'
import X from '@/components/Icons/Brands/X.vue'

const shortHash = ref(import.meta.env.VITE_BUILD_HASH_SHORT)
const mode = ref(import.meta.env.MODE)
const date = ref(new Date(import.meta.env.VITE_BUILD_DATE))
const branch = ref(import.meta.env.VITE_BRANCH)

const uri = (s: string): string => `https://${window.GLOBAL_ENV.LINK_HOST}/${s}?utm_source=wizzl.app&utm_medium=settings`

const links = ref([
  { icon: Discord, url: uri('discord'), title: 'discord' },
  { icon: Instagram, url: uri('instagram'), title: 'instagram' },
  { icon: X, url: uri('x'), title: 'x' },
])
</script>
