<template>
  <PushButton
    :is-link="isLink"
    :toName="toName"
    :toParams="toParams"
    :loading="loading"
    class="transition-colors text-white w-full bg-secondary-all py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    <slot/>
  </PushButton>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import type { RouteParamsRaw } from 'vue-router'

defineProps<{
  isLink?: boolean
  toName?: string
  toParams?: RouteParamsRaw
  loading?: boolean
}>()
</script>