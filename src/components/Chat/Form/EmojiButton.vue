<template>
  <button
    @click="$emit('send', emote)"
    class="transition-colors text-md w-9 h-9 min-w-9 min-h-9 p-2 flex items-center justify-center rounded-full hover:bg-tertiary hover:bg-opacity-50"
  >
    <span v-emoji>
      {{ emote }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  emoji?: string | undefined
}>()

const emote = computed(() => (props.emoji ? props.emoji : '✨'))
</script>
