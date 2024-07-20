<template>
  <button
    @click="$emit('submit')"
    :disabled="processing"
    class="transition-colors text-white w-full bg-secondary-all py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
  >
    <span>{{ $t(title) }}</span>
    <Spinner v-if="processing" />
  </button>
</template>

<script setup lang="ts">
import Spinner from '@/components/Icons/Spinner.vue'

defineProps<{
  title: string
  processing?: boolean
}>()
</script>
