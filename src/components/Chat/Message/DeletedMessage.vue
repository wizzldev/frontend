<template>
  <div
    class="cursor-pointer w-max max-w-full rounded-lg break-words z-0 border-2 border-dashed"
    :class="{
      'border-secondary rounded-l-3xl ml-auto': sentByMe,
      'border-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last'),
      customBorder: theme
    }"
  >
    <p class="px-4 py-1.5 text-gray-400" :class="{ customText: theme }">
      {{ $t('Deleted message') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeDataMain } from '@/types/chat'

const props = defineProps<{
  place: Array<string>
  sentByMe: boolean
  theme: ThemeDataMain | undefined
}>()

const border = computed(() =>
  props.sentByMe ? props.theme?.message?.you.bg : props.theme?.message?.other.bg
)
</script>

<style scoped>
.customBorder {
  border-color: v-bind('border') !important;
}

.customText {
  color: v-bind('border') !important;
}
</style>
