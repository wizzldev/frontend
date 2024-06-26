<template>
  <div
    class="cursor-pointer w-max max-w-full rounded-lg break-words z-0 border-2 border-dashed"
    :class="{
      'border-secondary rounded-l-3xl ml-auto': sentByMe,
      'border-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last')
    }"
  >
    <p class="px-4 py-1.5 text-gray-400">
      {{ $t('Deleted message') }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  place: Array<string>
  sentByMe: boolean
}>()
</script>
