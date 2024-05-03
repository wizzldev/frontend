<template>
  <div class="relative">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <Magnifier class="text-gray-400" />
    </div>
    <input
      class="w-full bg-secondary pl-12 pr-4 py-2 rounded-xl"
      placeholder="Search"
    />
  </div>
</template>
<script setup lang="ts">
import Magnifier from '@/components/Icons/Magnifier.vue'
</script>