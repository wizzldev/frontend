<template>
  <section class="my-3">
    <h4 class="text-gray-400 text-sm my-2">{{ $t(title) }}</h4>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
