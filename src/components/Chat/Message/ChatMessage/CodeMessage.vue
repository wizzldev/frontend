<template>
  <div>
    <div
      class="px-2 py-1 w-full flex items-center justify-between rounded-t text-xs text-gray-300 border"
      :class="{
        '!bg-secondary border-secondary': !sentByMe,
        '!bg-tertiary border-tertiary': sentByMe
      }"
    >
      <h3>{{ ucFirst(m.lang || 'unknown') }}</h3>
      <p>Copy</p>
    </div>
    <pre
      v-highlightjs
    ><code :class="[m.lang, 'rounded-lg rounded-t-none border border-t-0', {'!bg-secondary border-tertiary': sentByMe, '!bg-tertiary border-secondary': !sentByMe}]">{{ m.content }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ucFirst } from '@/scripts/ucfirst'

defineProps<{
  sentByMe: boolean
  m: { content: string; is_code: boolean; lang: string | null }
}>()
</script>
