<template>
  <p class="text-center text-sm text-gray-400">
    {{ date }}
  </p>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import { computed } from 'vue'

const props = defineProps<{
  message: Message
}>()

const date = computed(() => {
  const now = new Date()
  const d = new Date(props.message.created_at)
  const builder = []
  if (now.getFullYear() != d.getFullYear()) builder.push(d.getFullYear())
  if (now.getMonth() != d.getMonth()) builder.push(d.toLocaleString('default', { month: 'long' }))
  if (builder.length != 0 && now.getDay() != d.getDay()) builder.push(d.getDay())
  if (builder.length > 0) builder.push('-')
  builder.push(`${d.getHours()}:${d.getMinutes() <= 9 ? '0' + d.getMinutes() : d.getMinutes()}`)
  return builder.join(' ')
})
</script>
