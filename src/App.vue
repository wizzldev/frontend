<script setup lang="ts">
import { type RouteLocationNormalized, RouterView, useRoute, useRouter } from 'vue-router'
import setup from '@/scripts/mobile/setup'
import InfiniteLoader from '@/components/Loaders/InfiniteLoader.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useRouteLoaderStore } from '@/stores/routeLoader'
import { onMounted, ref, watch } from 'vue'
import TermsModal from '@/components/Modals/TermsModal.vue'
import {  WizzlTermsAccepted } from '@/scripts/consts'
import { isApp } from '@/scripts/mobile/isApp'
import NetworkError from '@/components/Loaders/NetworkError.vue'
import { useAuthStore } from '@/stores/auth'
import { useLogger } from '@/stores/logger'
import { useContactsStore } from '@/stores/contacts'

const router = useRouter()
const route = useRoute()
const loader = useRouteLoaderStore()
const auth = useAuthStore()
const { log } = useLogger()
const contacts = useContactsStore()

watch(route, (r: RouteLocationNormalized) => {
  isTermsPage.value = ['service.terms', 'service.privacy'].includes(r.name as string)
  if(isApp() && r.name == 'home') router.push({name: 'chat.contacts'})
})

watch(auth, (current, old) => {
  if(!current.isLoggedIn && old.isLoggedIn) router.push('/')
})

const isTermsPage = ref(false)
const isTermsAccepted = ref(window.localStorage.getItem(WizzlTermsAccepted) == 'true')
const accept = () => {
  isTermsAccepted.value = true
  window.localStorage.setItem(WizzlTermsAccepted, 'true')
}

setup(router)

onMounted(async () => {
  log('App.vue', 'Mounted successfully.')

  window.addEventListener('focus', () => {
    contacts.contacts = []
  })

  if (!isApp()) return
  document.body.setAttribute('data-platform', 'mobile')
})
</script>

<template>
  <RouterView v-if="loader.isLoaded" v-slot="{ Component, route }">
    <transition name="main-fade" mode="out-in" appear>
      <div :key="route.name || '__unknown__'">
        <component :is="Component" />
      </div>
    </transition>
  </RouterView>
  <AppLayout v-if="!loader.isLoaded && loader.networkError" class="!flex-1 items-center justify-center">
    <NetworkError v-if="loader.networkError" />
    <InfiniteLoader v-else />
  </AppLayout>
  <TermsModal v-if="!isTermsAccepted && !isTermsPage" @accept="accept" />
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
