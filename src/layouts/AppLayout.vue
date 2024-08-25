<template>
  <div
    data-app-layout
    id="app-view"
    class="max-w-sm bg-main h-screen max-h-screen overflow-hidden mx-auto sm:border-x border-secondary flex flex-col overflow-y-scroll"
  >
    <div v-if="false" class="px-4 py-0.5 text-center text-xs bg-red-400">
      {{ $t('error.network') }}
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>