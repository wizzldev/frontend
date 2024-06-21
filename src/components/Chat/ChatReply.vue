<template>
  <PushButton
    :is-link="false"
    class="w-6 h-6 flex items-center justify-center text-sm text-gray-400 rounded-full bg-secondary"
  >
    <Reply />
  </PushButton>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Reply from '@/components/Icons/Reply.vue'
</script>
