<template>
  <li
    class="text-3xl relative cursor-pointer px-4 py-1.5 w-max max-w-full break-words"
    :class="{'ml-auto': sentByMe}"
    @dblclick="$emit('like', message.id)"
  >
    <p>{{ message.content }}</p>
  </li>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'

defineProps<{
  sentByMe: boolean
  message: Message
}>()
</script>