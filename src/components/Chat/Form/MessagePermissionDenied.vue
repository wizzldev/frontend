<template>
  <section class="w-full bg-secondary px-4 py-3" :class="{ 'theme-bg': theme }">
    <h2 class="fontTheme text-gray-400 text-center px-4" :class="{ 'theme-color': theme }">
      {{ $t('You are not allowed to send a message') }}
    </h2>
  </section>
</template>

<script setup lang="ts">
import type { ThemeDataBottom } from '@/types/chat'

defineProps<{
  theme: ThemeDataBottom | undefined
}>()
</script>

<style scoped>
.theme-bg {
  background: v-bind('theme?.bg') !important;
}

.theme-color {
  color: v-bind('theme?.text') !important;
}
</style>
