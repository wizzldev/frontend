<template>
  <li
    :data-emoji="isEmoji"
    :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
    class="relative w-max max-w-full mt-1"
    :class="{
      'ml-auto z-0': sentByMe,
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
          <MessageLike :sent-by-me="sentByMe" :likes="message.likes || []" />
          <p class="text-xs text-red-400" v-if="failed">Failed to send message</p>
        </div>
        <div v-if="!sentByMe"></div>
      </div>
      <span
        class="ml-auto right-0 text-gray-400 text-xs self-end"
        v-if="sentByMe && (message.hookId || failed)"
      >
        <Circle v-if="!failed" />
        <CircleTimes class="text-red-400" v-else />
      </span>
      <MessageReply :flip="false" :show="sentByMe" :distance="distance" />
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Like, Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/chat'
import { computed, ref, watch } from 'vue'
import { onLongPress, usePointerSwipe } from '@vueuse/core'
import { isApp } from '@/scripts/mobile/isApp'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { getDistance } from '@/components/Chat/Message/swipe'
import MessageReply from '@/components/Chat/Utils/MessageReply.vue'
import Circle from '@/components/Icons/Circle.vue'
import CircleTimes from '@/components/Icons/CircleTimes.vue'
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
const containerWidth = computed(() => wrap.value?.offsetWidth)
const vibrated = ref(false)

const swipeStyle = computed(() =>
  props.sentByMe ? { right: distance.value + 'px' } : { left: distance.value + 'px' }
)

const failed = computed(() => {
  return (
    props.message.id &&
    new Date(props.message.created_at).getTime() > new Date().getTime() + 15 * 1000
  )
})

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
    vibrated.value = false
  }
})

watch(distance, async (value) => {
  if (value < 150) return
  if (isApp() && !vibrated.value) await Haptics.impact({ style: ImpactStyle.Light })
  vibrated.value = true
  emit('reply', props.message)
})
</script>
