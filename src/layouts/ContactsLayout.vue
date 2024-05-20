<template>
  <AppLayout>
    <MyProfile />
    <slot />
  </AppLayout>
</template>

<script setup lang="ts">
import MyProfile from '@/components/Navigation/MyProfile.vue'
import AppLayout from '@/layouts/AppLayout.vue'
</script>
