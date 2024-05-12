<template>
  <AppLayout>
    <ChatProfile
      :name="chatProfile.name"
      :image="chatProfile.image"
      :loading="chatProfile.loading"
      :connection="connection"
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
  connection: { connected: boolean; error: boolean }
  theme: ThemeDataTop | undefined
}>()
</script>
