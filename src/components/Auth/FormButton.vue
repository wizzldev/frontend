<template>
  <button
    @click="$emit('submit')"
    :disabled="processing"
    class="transition-colors w-full bg-purple-500 hover:bg-purple-400 focus:bg-purple-600 py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    <span>{{ $t(title) }}</span>
    <Spinner v-if="processing" />
  </button>
</template>

<script setup lang="ts">
import Spinner from '@/components/Icons/Spinner.vue'

defineProps<{
  title: string
  processing: boolean
}>()
</script>
