<template>
  <AppLayout>
    <GuestNav />
    <main class="h-full flex flex-col space-y-3">
      <div class="my-auto mx-3">
        <slot />
      </div>
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import GuestNav from '@/components/Navigation/GuestNav.vue'
</script>
