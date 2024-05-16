<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import setup from '@/scripts/mobile/setup'
import InfiniteLoader from '@/components/Loaders/InfiniteLoader.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useRouteLoaderStore } from '@/stores/routeLoader'

const router = useRouter()
const loader = useRouteLoaderStore()

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
  <AppLayout v-else class="!flex-1 items-center justify-center">
    <InfiniteLoader/>
  </AppLayout>
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
