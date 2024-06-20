<script setup lang="ts">
import { type RouteLocationNormalized, RouterView, useRoute, useRouter } from 'vue-router'
import setup from '@/scripts/mobile/setup'
import InfiniteLoader from '@/components/Loaders/InfiniteLoader.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useRouteLoaderStore } from '@/stores/routeLoader'
import { ref, watch } from 'vue'
import TermsModal from '@/components/Modals/TermsModal.vue'
import { WizzlTermsAccepted } from '@/scripts/consts'

const router = useRouter()
const route = useRoute()
const loader = useRouteLoaderStore()

watch(route, (r: RouteLocationNormalized) => {
  isTermsPage.value = ['service.terms', 'service.privacy'].includes(r.name as string);
})

const isTermsPage = ref(false)
const isTermsAccepted = ref(window.localStorage.getItem(WizzlTermsAccepted) == 'true')
const accept = () => {
  isTermsAccepted.value = true
  window.localStorage.setItem(WizzlTermsAccepted, 'true')
}

setup(router)
</script>

<template>
  <RouterView v-if="loader.isLoaded" v-slot="{ Component, route }">
    <transition name="main-fade" mode="out-in" appear>
      <div :key="route.name || '__unknown__'">
        <component :is="Component" />
      </div>
    </transition>
  </RouterView>
  <AppLayout v-show="!loader.isLoaded" class="!flex-1 items-center justify-center">
    <InfiniteLoader/>
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
