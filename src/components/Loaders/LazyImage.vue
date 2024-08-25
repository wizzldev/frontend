<template>
  <img v-if="src" :class="imgClass" v-show="loaded" :src="src" :alt="alt" @load="onLoad" @error="onError" />
  <div
    :class="imgClass"
    v-else-if="!loaded"
    class="p-1 animate-pulse flex items-center justify-center bg-secondary"
  >
    <Error v-if="failed" class="text-red-300 cursor-not-allowed" />
    <Spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { sleep as sleeper } from '@/scripts/sleep'
import Error from '@/components/Icons/Error.vue'
import Spinner from '@/components/Icons/Spinner.vue'

const props = defineProps<{
  sleep?: number
  src?: string
  alt: string
  class?: string
}>()

const loaded = ref(false)
const failed = ref(false)

const imgClass = computed(() => props.class || '')

const onLoad = async () => {
  if (props.sleep) await sleeper(props.sleep)
  loaded.value = true
}

const onError = async () => {
  if (props.sleep) await sleeper(props.sleep)
  loaded.value = false
  failed.value = true
}
</script>
