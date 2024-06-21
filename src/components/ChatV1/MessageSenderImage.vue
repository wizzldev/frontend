<template>
  <img class="w-5 h-5 rounded-full mb-2" :src="image_url" :alt="`${first_name}'s profile image`" />
</template>

<script setup lang="ts">
defineProps<{
  image_url: string
  first_name: string
}>()
</script>
