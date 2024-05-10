<template>
  <div class="relative">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <component :is="icon" class="text-gray-400" />
    </div>
    <input
      class="w-full bg-secondary pl-12 pr-4 py-2 rounded-xl"
      :placeholder="$t(placeholder)"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  placeholder: string
}>()
</script>
