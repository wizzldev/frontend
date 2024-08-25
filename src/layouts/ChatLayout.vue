<template>
  <AppLayout>
    <ChatProfile
      :name="chatProfile.name"
      :image="chatProfile.image"
      :loading="chatProfile.loading"
      :theme="theme"
      :isYou="isYou"
      :verified="chatProfile.is_verified"
      :to-name="toName"
      :to-params="toParams"
    />
    <slot />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import ChatProfile from '@/components/Navigation/ChatProfile.vue'
import type { ThemeDataTop } from '@/types/theme'
import type { RouteParamsRaw } from 'vue-router'

defineProps<{
  chatProfile: { name: string; image: string; loading: boolean; is_verified: boolean }
  theme: ThemeDataTop | undefined
  isYou: boolean
  toName?: string
  toParams?: RouteParamsRaw
}>()
</script>
