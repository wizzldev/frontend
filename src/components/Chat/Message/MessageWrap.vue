<template>
  <MessageWrapNonSwipable
    v-if="!isSwipable"
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
import type { ThemeDataMain } from '@/types/chat'
import MessageWrapNonSwipable from '@/components/Chat/Message/MessageWrapNonSwipable.vue'
import { computed } from 'vue'
import MessageWrapSwipable from '@/components/Chat/Message/MessageWrapSwipable.vue'

const props = defineProps<{
  sentByMe: boolean
  isEmoji: boolean
  likes: Array<Like>
  theme: ThemeDataMain | undefined
  message: Message
}>()

const isSwipable = computed(() => ['message', 'emoji'].includes(props.message.type))
</script>
