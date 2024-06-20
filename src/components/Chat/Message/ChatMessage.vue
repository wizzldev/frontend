<template>
  <div
    class="cursor-pointer w-max max-w-full rounded-lg break-words ml-auto z-0"
    :class="{
      'bg-secondary rounded-l-3xl': sentByMe,
      'bg-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last')
    }"
  >
    <p class="px-4 py-1.5">
      {{ message.content }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'

defineProps<{
  message: Message
  place: Array<string>
  sentByMe: boolean
}>()
</script>