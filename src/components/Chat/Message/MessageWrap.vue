<template>
  <MessageWrapNonSwipable
    v-if="!isSwipable || !canSendMessage"
    :sent-by-me="sentByMe"
    :is-emoji="isEmoji"
    :theme="theme"
    :message="message"
    :likes="likes"
  >
    <slot />
  </MessageWrapNonSwipable>
  <MessageWrapSwipable
    v-else
    :sent-by-me="sentByMe"
    :is-emoji="isEmoji"
    :theme="theme"
    :message="message"
    :likes="likes"
  >
    <slot />
  </MessageWrapSwipable>
</template>

<script setup lang="ts">
import type { Like, Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/theme'
import MessageWrapNonSwipable from '@/components/Chat/Message/MessageWrapNonSwipable.vue'
import { computed } from 'vue'
import MessageWrapSwipable from '@/components/Chat/Message/MessageWrapSwipable.vue'

const props = defineProps<{
  sentByMe: boolean
  isEmoji: boolean
  likes: Array<Like>
  theme: ThemeDataMain | undefined
  message: Message
  canSendMessage: boolean
  disableSwipe?: boolean
}>()

const isSwipable = computed(
  () =>
    ['message', 'emoji'].includes(props.message.type) &&
    !props.message.content.includes('```') &&
    !props.disableSwipe
)
</script>
