<template>
  <Bounce>
    <div
      v-if="show && distance > 25"
      class="w-6 min-w-6 h-6 min-h-6 flex items-center justify-center bg-secondary rounded-full text-gray-400"
    >
      <Reply :class="{ '-scale-x-100': flip }" />
    </div>
  </Bounce>
</template>

<script setup lang="ts">
import Reply from '@/components/Icons/Reply.vue'
import Bounce from '@/components/Transitions/Bounce.vue'

defineProps<{
  show: boolean
  distance: number
  flip: boolean
}>()
</script>
