<template>
  <li :data-emoji="isEmoji" :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
      class="relative w-max max-w-full mt-1 break-words"
      :class="{
        'ml-auto rounded-l-3xl z-0': sentByMe,
        'rounded-r-3xl': !sentByMe,
      }"
      ref="wrap"
  >
    <slot/>
    <MessageLike :likes="likes || []" :sent-by-me="sentByMe" />
  </li>
</template>

<script setup lang="ts">
import type { Like, Message } from '@/types/message'
import MessageLike from '@/components/Chat/Utils/MessageLike.vue'
import type { ThemeDataMain } from '@/types/chat'
import { ref } from 'vue'
import { onLongPress } from '@vueuse/core'
import { isApp } from '@/scripts/mobile/isApp'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

const props = defineProps<{
  sentByMe: boolean
  isEmoji: boolean
  likes: Array<Like>
  theme: ThemeDataMain | undefined
  message: Message
}>()

const emit = defineEmits(['modal'])
const wrap = ref()

onLongPress(wrap, async () => {
  if(isApp()) await Haptics.impact({ style: ImpactStyle.Light })
  emit('modal', props.message)
}, {delay: 300})
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
