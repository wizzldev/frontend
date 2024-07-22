<template>
  <a v-if="!isApp()">
    <slot />
  </a>
  <button v-else @click="browser">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { isApp } from '@/scripts/mobile/isApp'
import { Browser } from '@capacitor/browser'

const props = defineProps<{
  href: string
}>()

const browser = async () => {
  await Browser.open({ url: props.href })
}
</script>
