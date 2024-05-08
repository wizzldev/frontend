<template>
  <AppLayout>
    <ChatProfile :name="chatProfile.name" :image="chatProfile.image" :loading="chatProfile.loading" />
    <slot/>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import ChatProfile from '@/components/Navigation/ChatProfile.vue'

defineProps<{
  chatProfile: {name: string; image: string; loading: boolean; };
}>()
</script>