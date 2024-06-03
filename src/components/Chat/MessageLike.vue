<template>
  <Transition name="bounce">
  <div data-fake-ul v-if="show"
       class="text-xs z-2 relative -mt-1.5 w-max"
      :class="{'ml-auto mr-2': sentByMe, 'ml-2': !sentByMe}"
  >
      <button  class="px-2 py-0.5 rounded-3xl w-max" :class="{'bg-tertiary': sentByMe, 'bg-secondary': !sentByMe}">
        <span :data-likeIds="message.likes.map(l => l.id).join('.')">{{ message.likes.map(l => l.emoji).join(' ') }}</span>
      </button>
  </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import { computed } from 'vue'

const props = defineProps<{
  sentByMe: boolean
  message: Message
}>()


const show = computed(() => props.message.likes && props.message.likes.length > 0)
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