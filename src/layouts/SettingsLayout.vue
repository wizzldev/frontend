<template>
  <AppLayout>
    <SettingsNav />
    <main class="h-full flex flex-col space-y-3 overflow-y-scroll overflow-x-hidden">
      <slot />
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import SettingsNav from '@/components/Navigation/SettingsNav.vue'
</script>
