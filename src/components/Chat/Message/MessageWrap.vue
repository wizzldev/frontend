<template>
  <li :data-emoji="isEmoji" :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
      class="relative w-max max-w-full mt-1 break-words"
      :class="{
        'ml-auto rounded-l-3xl z-0': sentByMe,
        'rounded-r-3xl': !sentByMe,
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
