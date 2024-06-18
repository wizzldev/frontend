<template>
  <ul class="py-2 px-4 h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse text-white" :class="{customTheme: theme}">
    <li class="w-full" v-for="(msg, inx) in messageList" :key="inx">
      <MessageGroup :theme="theme" @like="(id: number) => $emit('like', id)" :messages="msg" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Messages } from '@/types/message'
import type { ThemeDataMain } from '@/types/chat'
import MessageGroup from '@/components/Chat/MessageGroup.vue'
import { computed } from 'vue'
import { messageSorter } from '@/components/Chat/messageSorter'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  messages: Messages
  theme: ThemeDataMain | undefined
}>()

const auth = useAuthStore()

const messageList = computed(() => messageSorter(props.messages, auth.user?.id || -1))
</script>

<style scoped>
.customTheme {
  background-color: v-bind('theme?.bg') !important;
  color: v-bind('theme?.text') !important;
  background-image: v-bind('theme?.bgImage');
  background-position: center;
  background-size: contain;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

@media only screen and (max-width: 600px) {
  .customTheme {
    background-size: cover;
  }
}
</style>
