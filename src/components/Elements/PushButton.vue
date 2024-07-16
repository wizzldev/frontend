<template>
  <router-link
    :to="linkData"
    class="block transition-colors"
    role="button"
    v-if="isLink && !isApp()"
  >
    <slot />
  </router-link>
  <button class="transition-colors flex items-center space-x-2" @click="handle" v-else>
    <span>
      <slot />
    </span>
    <Spinner v-if="loading" />
  </button>
</template>

<script setup lang="ts">
import { isApp } from '@/scripts/mobile/isApp'
import { type RouteLocationRaw, type RouteParamsRaw, useRouter } from 'vue-router'
import { computed } from 'vue'
import Spinner from '@/components/Icons/Spinner.vue'

const props = defineProps<{
  isLink: boolean
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
