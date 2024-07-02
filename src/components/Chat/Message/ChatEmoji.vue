<template>
  <p class="text-3xl px-4 py-1.5 cursor-pointer" v-emoji>
    {{ message.content }}
  </p>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'

defineProps<{
  message: Message
}>()
</script>
