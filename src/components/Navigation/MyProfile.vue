<template>
  <header class="px-5 py-4 flex items-center justify-between border-b-secondary z-10">
    <div class="flex items-center space-x-2 transition-all">
      <Slide>
        <PushButton v-if="backButton"
                    :is-link="true"
                    :to-name="backButton.route"
                    :to-params="backButton.params || {} as RouteParamsRaw"
                    class="bg-secondary-all rounded-full p-2 flex items-center justify-center text-gray-400"
        >
          <BackArrow />
        </PushButton>
      </Slide>
      <LazyImage class="w-8 h-8 rounded-full" :src="auth.user?.image_url" :alt="userImageAlt" />
      <h2 class="text-lg font-bold fontTheme">{{ $t('Chats') }}</h2>
    </div>
    <div class="flex items-center space-x-2">
      <PushButton
        class="bg-secondary-all text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
        :is-link="false"
      >
        <Support />
      </PushButton>
      <PushButton
        class="bg-secondary-all text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
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
import type { RouteParamsRaw } from 'vue-router'
import BackArrow from '@/components/Icons/BackArrow.vue'
import Slide from '@/components/Transitions/Slide.vue'
import LazyImage from '@/components/Loaders/LazyImage.vue'

defineProps<{
  backButton?: { route: string; params?: RouteParamsRaw }
}>()

const auth = useAuthStore()

const userImageAlt = computed(() => `${auth.user?.first_name}'s profile image`)
</script>
