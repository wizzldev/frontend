<template>
  <ul
      class="h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse"
      :class="{ customTheme: theme }"
    >
    <li v-for="(msg, inx) in messageGroup" :key="inx">
      <Message @like="(id: number) => $emit('like', id)" :theme="theme" :messages="msg" /></li>
  </ul>
</template>

<script setup lang="ts">
import Message from '@/components/Chat/Message.vue'
import type { MessageGroupList, Messages } from '@/types/message'
import { computed } from 'vue'
import type { ThemeDataMain } from '@/types/chat'

const props = defineProps<{
  messages: Messages
  theme: ThemeDataMain | undefined
}>()

const messageGroup = computed((): MessageGroupList => {
  let data = [] as MessageGroupList

  if(props?.messages?.length < 1) return data

  for (let i = 0; i < props.messages.length; i++) {
    const msg = props.messages[i]

    if (['message', 'file:file', 'file:image'].includes(msg.type)) {
      if (
        data.length == 0 ||
        (data.length > 0 && (data[data.length - 1].sender.id != msg.sender.id || ['message', 'file:file', 'file:image'].includes(data[data.length - 1].type)))
      ) {
        data.push({ type: 'message', sender: msg.sender, messages: [msg] })
      } else data[data.length - 1].messages = [msg, ...data[data.length - 1].messages]
    } else if (data.length == 0 || (data.length > 0 && data[data.length - 1].type != 'info')) {
      data.push({ type: 'info', sender: msg.sender, messages: [msg] })
    } else data[data.length - 1].messages = [msg, ...data[data.length - 1].messages]
  }

  return data
})
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
