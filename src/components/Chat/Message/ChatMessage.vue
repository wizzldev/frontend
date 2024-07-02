<template>
  <div
    class="cursor-pointer w-max max-w-full rounded-lg break-words z-0"
    :class="{
      'bg-secondary rounded-l-3xl ml-auto': sentByMe,
      'bg-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last'),
      customBg: theme
    }"
  >
    <p class="px-4 py-1.5" :class="{ customText: theme }" v-emoji>
      {{ message.content }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/chat'
import { computed } from 'vue'

const props = defineProps<{
  message: Message
  place: Array<string>
  sentByMe: boolean
  theme: ThemeDataMain | undefined
}>()

const bg = computed(() =>
  props.sentByMe ? props.theme?.message?.you.bg : props.theme?.message?.other.bg
)
const color = computed(() =>
  props.sentByMe ? props.theme?.message?.you.text : props.theme?.message?.other.text
)
</script>

<style scoped>
.customText {
  color: v-bind('color') !important;
}
.customBg {
  background-color: v-bind('bg') !important;
}
</style>
