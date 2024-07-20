<template>
  <router-link
    :to="linkData"
    class="block transition-colors"
    role="button"
    v-if="isLink && !isApp()"
  >
    <slot />
  </router-link>
  <button
    :disabled="loading"
    class="transition-colors"
    :class="{ 'flex items-center space-x-2 justify-center': loading }"
    @click="handle"
    v-else
  >
    <span v-if="loading">
      <slot />
    </span>
    <Spinner v-if="loading" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { isApp } from '@/scripts/mobile/isApp'
import { type RouteLocationRaw, type RouteParamsRaw, useRouter } from 'vue-router'
import { computed } from 'vue'
import Spinner from '@/components/Icons/Spinner.vue'

const props = defineProps<{
  isLink?: boolean
  toName?: string
  toParams?: RouteParamsRaw
  loading?: boolean
}>()

const router = useRouter()

const linkData = computed(
  () =>
    ({ name: props.toName as string, params: props.toParams as RouteParamsRaw }) as RouteLocationRaw
)

const handle = () => {
  if (props.isLink && isApp()) {
    router.push(linkData.value)
  }
}
</script>
