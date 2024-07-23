<template>
  <div class="relative" :class="{ 'border border-tertiary rounded-xl': hasBorder }">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none" v-if="icon">
      <component :is="icon" class="text-gray-400" />
    </div>
    <input
      class="w-full bg-secondary-all px-4 py-2 rounded-xl"
      :class="{ 'pl-12': icon }"
      :placeholder="$t(placeholder)"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :disabled="disabled || false"
      :value="value || ''"
      :type="type || 'text'"
    />
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon?: Component | undefined
  placeholder: string
  disabled?: boolean
  value?: string
  type?: string
  hasBorder?: boolean
}>()
</script>
