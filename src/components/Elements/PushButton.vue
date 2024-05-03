<template>
  <a class="block" role="button" v-if="isLink && !isApp()">
    <slot/>
  </a>
  <button @click="handle" v-else>
    <slot/>
  </button>
</template>

<script setup lang="ts">
import { isApp } from '@/scripts/mobile/isApp'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isLink: boolean;
  toName?: string|undefined;
}>()

const router = useRouter()

const handle = () => {
  if(props.isLink && isApp()) {
    router.push({ name: (props.toName as string) })
  }
}
</script>