<template>
  <ul class="h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse">
    <li v-for="(msg, inx) in messageGroup" :key="inx">
      <Message :messages="msg" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import Message from '@/components/Chat/Message.vue'
import type { MessageGroupList, Messages } from '@/types/message'
import { computed } from 'vue'

const props = defineProps<{
  messages: Messages
}>()

const messageGroup = computed((): MessageGroupList => {
  let data = [] as MessageGroupList

  for (let i = 0; i < props.messages.length; i++) {
    const msg = props.messages[i]
    if (msg.type == 'message') {
      if (
        data.length == 0 ||
        (data.length > 0 && data[data.length - 1].sender.id != msg.sender.id)
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
