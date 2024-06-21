<template>
  <li
    :data-emoji="isEmoji"
    :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
    class="relative w-max max-w-full mt-1"
    :class="{
      'ml-auto rounded-l-3xl z-0': sentByMe,
      'rounded-r-3xl': !sentByMe,
      'transition-all duration-200 ease-linear': !isSwiping
    }"
    :style="swipeStyle"
    ref="wrap"
  >
    <div class="flex items-center justify-center space-x-2">
      <MessageReply :flip="true" :show="!sentByMe" :distance="distance" />
      <div class="grid grid-cols-5">
        <div v-if="sentByMe"></div>
        <div class="relative w-max max-w-full break-words col-span-4">
          <slot />
        </div>
        <div v-if="!sentByMe"></div>
      </div>
      <span
        class="ml-auto right-0 text-gray-400 text-xs self-end"
        v-if="sentByMe && message.hookId"
      >
        <Circle />
      </span>
      <MessageReply :flip="false" :show="sentByMe" :distance="distance" />
    </div>
    <MessageLike :likes="likes || []" :sent-by-me="sentByMe" />
  </li>
</template>

<script setup lang="ts">
import type { Like, Message } from '@/types/message'
import MessageLike from '@/components/Chat/Utils/MessageLike.vue'
import type { ThemeDataMain } from '@/types/chat'
import { computed, ref, watch } from 'vue'
import { onLongPress, usePointerSwipe } from '@vueuse/core'
import { isApp } from '@/scripts/mobile/isApp'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { getDistance } from '@/components/Chat/Message/swipe'
import MessageReply from '@/components/Chat/Utils/MessageReply.vue'
import Circle from '@/components/Icons/Circle.vue'

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
const containerWidth = computed(() => wrap.value?.offsetWidth)

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

const { distanceX, isSwiping } = usePointerSwipe(wrap, {
  disableTextSelect: true,
  onSwipe() {
    if (!containerWidth.value || !['message', 'emoji'].includes(props.message.type)) return
    const dist = getDistance(distanceX.value, props.sentByMe)
    if (dist > 30 || dist < -30) distance.value = dist
  },
  onSwipeEnd() {
    distance.value = 0
  }
})

watch(distance, async (value) => {
  if (value < 150) return
  if (isApp()) await Haptics.impact({ style: ImpactStyle.Light })
  emit('reply', props.message)
})
</script>
