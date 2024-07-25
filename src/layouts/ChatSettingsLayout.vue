<template>
  <ChatLayout :chat-profile="chatProfile" :is-you="isYou" :theme="theme" :to-params="toParams" :to-name="toName">
    <main class="h-full flex flex-col space-y-3 overflow-y-scroll overflow-x-hidden">
      <slot />
    </main>
  </ChatLayout>
</template>

<script setup lang="ts">
import type { ThemeDataTop } from '@/types/chat'
import ChatLayout from '@/layouts/ChatLayout.vue'
import type { RouteParamsRaw } from 'vue-router'

defineProps<{
  chatProfile: { name: string; image: string; loading: boolean; is_verified: boolean }
  theme: ThemeDataTop | undefined
  isYou: boolean
  toName?: string
  toParams?: RouteParamsRaw
}>()
</script>
