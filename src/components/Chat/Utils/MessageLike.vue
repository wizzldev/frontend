<template>
  <Transition name="bounce">
    <div
      v-if="show"
      class="text-xs z-99 w-max m-0.5"
      :class="{ 'ml-3': !sentByMe, 'text-right ml-2': sentByMe }"
    >
      <button class="px-2 py-0.5 rounded-lg bg-secondary border border-tertiary w-max">
        <span v-for="(count, emote) in mergedLikes" :key="emote">
          <template v-if="count > 1">{{ count }}</template> {{ emote }}
        </span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Like } from '@/types/message'
import { computed } from 'vue'

const props = defineProps<{
  sentByMe: boolean
  likes: Array<Like>
}>()

const show = computed(() => props.likes.length > 0)

const mergedLikes = computed(() => {
  const sorted = {} as Record<string, number>

  props.likes
    .map((l) => l.emoji)
    .forEach((e) => {
      if (Object.keys(sorted).includes(e)) sorted[e]++
      else sorted[e] = 1
    })

  return sorted
})
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
