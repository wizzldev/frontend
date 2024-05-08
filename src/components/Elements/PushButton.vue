<template>
  <router-link :to="{ name: (props.toName as string), params: (props.toParams as RouteParamsRaw) }" class="block" role="button" v-if="isLink && !isApp()">
    <slot/>
  </router-link>
  <button @click="handle" v-else>
    <slot/>
  </button>
</template>

<script setup lang="ts">
import { isApp } from '@/scripts/mobile/isApp'
import { type RouteParamsRaw, useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{
  isLink: boolean;
  toName?: string;
  toParams?: RouteParamsRaw;
}>()

const router = useRouter()

const handle = () => {
  if(props.isLink && isApp()) {
    router.push({ name: (props.toName as string), params: (props.toParams as RouteParamsRaw) })
  }
}
</script>