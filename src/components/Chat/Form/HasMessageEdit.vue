<template>
  <Fade>
    <div
      v-if="message && ['message', 'emoji'].includes(message.type)"
      @click="emit('detach')"
      class="bg-secondary-all cursor-pointer px-2 py-1.5 flex items-center justify-start space-x-3 w-full max-w-full"
    >
      <LazyImage
        alt="Your profile image"
        :src="cdnImage(message.sender.image_url)"
        class="w-6 h-6 rounded-full"
      />
      <div class="flex flex-wrap items-center w-full">
        <span class="text-purple-400">{{ $t('Edit') }}:</span>
        <span class="ml-1 w-[70%] break-all line-clamp-1 text-nowrap" v-emoji>{{
          message.content
        }}</span>
      </div>
    </div>
  </Fade>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import Fade from '@/components/Transitions/Fade.vue'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'

defineProps<{
  message?: Message | null
}>()

const emit = defineEmits(['detach'])
</script>
