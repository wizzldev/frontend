<template>
  <li v-if="!isEmoji" :data-emoji="isEmoji" :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
      class="relative cursor-pointer w-max max-w-full mt-1 rounded-lg break-words first:rounded-b-3xl last:rounded-t-3xl"
      :class="{
        'ml-auto bg-secondary rounded-l-3xl z-0': sentByMe,
        'bg-tertiary rounded-r-3xl': !sentByMe,
        customTheme: theme
      }"
  >
    <slot/>
    <MessageLike :likes="likes || []" :sent-by-me="sentByMe" />
  </li>
  <li
    v-else
    :class="{
       'ml-auto': sentByMe,
    }"
  >
    <slot/>
    <MessageLike :likes="likes || []" :sent-by-me="sentByMe" />
  </li>
</template>

<script setup lang="ts">
import type { Like } from '@/types/message'
import MessageLike from '@/components/Chat/Utils/MessageLike.vue'
import type { ThemeDataMain } from '@/types/chat'

defineProps<{
  sentByMe: boolean
  isEmoji: boolean
  likes: Array<Like>
  theme: ThemeDataMain | undefined
}>()
</script>

<style scoped>
.customTheme * {
  color: v-bind('theme?.text') !important;
}

.customTheme [data-theme='message-you'] {
  background: v-bind('theme?.message.you.bg') !important;
  color: v-bind('theme?.message.you.text') !important;
}

.customTheme [data-theme='message-other'] {
  background: v-bind('theme?.message.other.bg') !important;
  color: v-bind('theme?.message.other.text') !important;
}

.customTheme [data-theme='message-reply'] {
  background: v-bind('theme?.message.you.bg') !important;
  color: v-bind('theme?.message.you.text') !important;
  opacity: 70% !important;
}
</style>
