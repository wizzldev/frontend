<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import setup from '@/scripts/mobile/setup'
import InfiniteLoader from '@/components/Loaders/InfiniteLoader.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { onMounted } from 'vue'
import TermsModal from '@/components/Modals/TermsModal.vue'
import { isApp } from '@/scripts/mobile/isApp'
import { useAuth2Store } from '@/stores/auth2'
import { useLogger } from '@/stores/logger'
import { useLoader } from '@/stores/loader'
import { useI18n } from 'vue-i18n'
import { getLocale } from '@/i18n'

const router = useRouter()
const loader = useLoader()
const { log } = useLogger()
// init the auth system
await useAuth2Store().init()
// setup mobile
setup(router)

onMounted(async () => {
  log('App.vue', 'Mounted successfully.')

  useI18n().locale.value = await getLocale()

  if (!isApp()) return
  document.body.setAttribute('data-platform', 'mobile')
})
</script>

<template>
  <RouterView v-show="!loader.loading" v-slot="{ Component, route }">
    <transition name="main-fade" mode="out-in" appear>
      <div :key="route.name || '__unknown__'">
        <component :is="Component" />
      </div>
    </transition>
  </RouterView>
  <AppLayout v-if="loader.loading" class="!flex-1 items-center justify-center">
    <InfiniteLoader />
  </AppLayout>
  <TermsModal />
</template>

<style>
.main-fade-enter-active {
  transition: all 0.3s ease-out;
}
.main-fade-enter-from,
.main-fade-leave-to {
  opacity: 0;
}
</style>
