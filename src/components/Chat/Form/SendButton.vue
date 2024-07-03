<template>
  <button
    :disabled="input.length >= 500"
    class="transition-colors duration-500 flex items-center justify-center rounded-full p-2 w-9 h-9 min-w-9 min-h-9 disabled:!bg-red-400 disabled:cursor-not-allowed"
    :class="{
      'theme-icon': theme && inputEmpty,
      'bg-secondary border-secondary': inputEmpty,
      'bg-purple-500 border-purple-500 hover:bg-purple-400 hover:border-purple-400 focus:bg-purple-600 focus:border-purple-600':
        !inputEmpty
    }"
  >
    <Send class="!w-4 !h-4" />
  </button>
</template>

<script setup lang="ts">
import Send from '@/components/Icons/Send.vue'
import type { ThemeDataBottom } from '@/types/chat'

defineProps<{
  input: string
  inputEmpty: boolean
  theme: ThemeDataBottom | undefined
}>()
</script>

<style scoped>
.theme-icon {
  color: v-bind('theme?.input.text.default') !important;
  background-color: v-bind('theme?.input.bg.default') !important;
}
</style>
