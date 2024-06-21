<template>
  <Transition name="bounce">
    <div
      data-fake-ul
      v-if="show"
      class="absolute text-xs z-99 -mt-1.5 w-max"
      :class="{ 'ml-auto mr-2': sentByMe, 'ml-2': !sentByMe }"
    >
      <button
        class="px-2 py-0.5 rounded-3xl w-max"
        :class="{ 'bg-tertiary': sentByMe, 'bg-secondary': !sentByMe }"
      >
        <span :data-likeIds="likes.map((l) => l.id).join('.')">{{
          likes.map((l) => l.emoji).join(' ')
        }}</span>
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
