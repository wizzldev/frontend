<template>
  <PushButton
    class="transition bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 w-full rounded px-3 py-1.5 my-3"
  >
    <slot />
  </PushButton>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
</script>
