<template>
  <AppLayout>
    <MyProfile />
    <main class="h-full flex flex-col space-y-3">
      <slot />
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import MyProfile from '@/components/Navigation/MyProfile.vue'
import AppLayout from '@/layouts/AppLayout.vue'
</script>
