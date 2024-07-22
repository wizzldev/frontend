<template>
  <header class="px-5 py-4 flex items-center justify-between border-b border-secondary">
    <div class="flex items-center space-x-2">
      <PushButton
        :is-link="true"
        :to-name="backTo || 'chat.contacts'"
        class="bg-secondary rounded-full p-2 flex items-center justify-center text-gray-400"
      >
        <BackArrow />
      </PushButton>
      <img
        class="w-8 h-8 rounded-full"
        src="../../assets/branding/wizzl-pink-small-128.png"
        alt="Wizzl logo"
      />
      <h2
        class="text-lg font-bold fontTheme text-ellipsis text-nowrap overflow-hidden line-clamp-1"
      >
        Settings
      </h2>
    </div>
    <div class="flex items-center space-x-2">
      <PushButton
        class="bg-secondary text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
        :is-link="false"
        @click="auth.logout()"
      >
        <Logout />
      </PushButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import BackArrow from '@/components/Icons/BackArrow.vue'
import Logout from '@/components/Icons/Logout.vue'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  backTo?: string
}>()

const auth = useAuthStore()
</script>
