<template>
  <AppLayout>
    <ChatProfile
      :name="chatProfile.name"
      :image="chatProfile.image"
      :loading="chatProfile.loading"
      :theme="theme"
    />
    <slot />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import ChatProfile from '@/components/Navigation/ChatProfile.vue'
import type { ThemeDataTop } from '@/types/chat'

defineProps<{
  chatProfile: { name: string; image: string; loading: boolean }
  theme: ThemeDataTop | undefined
}>()
</script>
