<template>
  <li
    :data-emoji="isEmoji"
    :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
    class="relative w-max max-w-full mt-1"
    :class="{
      'ml-auto rounded-l-3xl z-0': sentByMe,
      'rounded-r-3xl': !sentByMe
    }"
    :style="swipeStyle"
    ref="wrap"
  >
    <div class="flex items-center justify-center space-x-2">
      <div class="grid grid-cols-5">
        <div v-if="sentByMe"></div>
        <div class="relative w-max max-w-full break-words col-span-4">
          <slot />
          <MessageLike :sent-by-me="sentByMe" :likes="message.likes || []" />
        </div>
        <div v-if="!sentByMe"></div>
      </div>
      <span
        class="ml-auto right-0 text-gray-400 text-xs self-end"
        v-if="sentByMe && message.hookId"
      >
        <Circle />
      </span>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Like, Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/theme'
import { computed, ref } from 'vue'
import { onLongPress } from '@vueuse/core'
import { isApp } from '@/scripts/mobile/isApp'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import Circle from '@/components/Icons/Circle.vue'
import MessageLike from '@/components/Chat/Utils/MessageLike.vue'

const props = defineProps<{
  sentByMe: boolean
  isEmoji: boolean
  likes: Array<Like>
  theme: ThemeDataMain | undefined
  message: Message
}>()

const emit = defineEmits(['modal', 'reply'])

const wrap = ref<HTMLElement | null>(null)
const distance = ref(0)

const swipeStyle = computed(() =>
  props.sentByMe ? { right: distance.value + 'px' } : { left: distance.value + 'px' }
)

onLongPress(
  wrap,
  async () => {
    if (isApp()) await Haptics.impact({ style: ImpactStyle.Light })
    emit('modal', props.message)
  },
  { delay: 300 }
)
</script>
