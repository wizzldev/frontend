<template>
  <span v-emoji>
    {{ content }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>
