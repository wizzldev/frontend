<template>
  <p class="px-4 py-1.5" :class="{ customText: theme }" v-emoji>
    <template v-for="(t, i) in text" :key="i">
      <a target="_blank" class="text-purple-400" v-if="isLink(t)" :href="createURL(t).toString()">
        {{ urlPreview(t) }}
      </a>
      <template v-else>
        {{ t }}
      </template>
    </template>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeDataMain } from '@/types/chat'
import tlds from 'tlds'

const props = defineProps<{
  sentByMe: boolean
  theme: ThemeDataMain | undefined
  content: string
}>()

const color = computed(() =>
  props.sentByMe ? props.theme?.message?.you.text : props.theme?.message?.other.text
)

const regex = /(https?:\/\/\S+|www\.\S+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;

const text = computed((): Array<string> => {

  return props.content.split(regex).filter(Boolean);
})

const createURL = (s: string): URL => {
  return new URL(s.includes('://') ? s : `https://${s}`)
}

const isLink = (s: string): boolean => {
  if(!regex.test(s)) return false
  const url = createURL(s)
  const tld = url.hostname.split('.').pop()
  return tld ? tlds.includes(tld) : false
}

const urlPreview = (s: string) => {
  const url = createURL(s)
  return url.hostname + (url.pathname == '/' ? '' : url.pathname)
}
</script>

<style scoped>
.customText {
  color: v-bind('color') !important;
}
</style>