<script setup lang="ts">
import { RouterView } from 'vue-router'
import setup from '@/scripts/mobile/setup'

setup()
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <transition name="main-fade" mode="out-in" appear>
      <div :key="route.name || '__unknown__'">
        <component :is="Component" />
      </div>
    </transition>
  </RouterView>
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