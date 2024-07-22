<template>
  <div
    class="cursor-pointer w-max max-w-full rounded-lg break-words whitespace-pre-wrap z-0"
    :class="{
      'bg-secondary rounded-l-3xl ml-auto': sentByMe,
      'bg-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last'),
      customBg: theme
    }"
  >
    <MessageContentParagraph :content="message.content" :sent-by-me="sentByMe" :theme="theme" />
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/chat'
import MessageContentParagraph from '@/components/Chat/Message/ChatMessage/MessageContentParagraph.vue'

defineProps<{
  sentByMe: boolean
  message: Message
  theme?: ThemeDataMain | undefined
  place: Array<string>
}>()
</script>
