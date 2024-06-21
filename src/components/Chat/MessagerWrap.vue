<template>
  <div
    :class="{
      'pr-3': sentByMe,
      'pl-3': !sentByMe
    }"
  >
    <div v-if="!sentByMe" class="col-span-4 flex items-end space-x-2 w-full">
      <LazyImage
        class="w-6 h-6 rounded-full mb-2"
        :src="cdnImage(sender.image_url, 64)"
        :alt="`${sender.first_name}'s profile image`"
      />
      <div class="w-full">
        <p class="text-xs ml-2" :class="{ 'text-gray-400': !theme }">{{ sender.first_name }}</p>
        <slot />
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/user'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import { cdnImage } from '@/scripts/image'
import type { ThemeDataMain } from '@/types/chat'

defineProps<{
  sentByMe: boolean
  sender: User
  theme: ThemeDataMain | undefined
}>()
</script>
