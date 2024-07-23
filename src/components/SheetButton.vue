<template>
  <PushButton
    class="w-full px-3 py-2.5 bg-secondary-all flex items-center"
  >
    <component class="!w-6 !h-6 text-gray-400" v-if="icon" :is="icon" />
    <span class="ml-3"><slot/></span>
  </PushButton>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import type { Component } from 'vue'
defineProps<{
  icon?: Component
}>()
</script>