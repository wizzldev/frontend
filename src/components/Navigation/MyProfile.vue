<template>
  <header class="px-5 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <img class="w-8 h-8 rounded-full" :src="auth.user?.image_url" :alt="userImageAlt" />
      <h2 class="text-lg font-bold fontTheme">{{ $t('Chats') }}</h2>
    </div>
    <div class="flex items-center space-x-2">
      <PushButton
        class="bg-secondary text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
        :is-link="false"
      >
        <Support />
      </PushButton>
      <PushButton
        class="bg-secondary text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
        :is-link="true"
        to-name="settings.default"
      >
        <Settings />
      </PushButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import PushButton from '@/components/Elements/PushButton.vue'
import Settings from '@/components/Icons/Settings.vue'
import Support from '@/components/Icons/Support.vue'

const auth = useAuthStore()

const userImageAlt = computed(() => `${auth.user?.first_name}'s profile image`)
</script>
