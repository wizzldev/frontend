<template>
  <ChatLayout
    :theme="theme?.dark?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
    :connection="{ connected, error: connectionError }"
  >
    <MessageList @like="like" :theme="theme?.dark?.main" :messages="chat.messages[chatID] || []" />
    <SendForm :value="message" :theme="theme?.dark?.bottom" v-model.lazy="message" @send="send" @emoji="emoji" />
  </ChatLayout>
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Like, Message as WSMessage, Messages } from '@/types/message'
import MessageList from '@/components/Chat/MessageList.vue'
import { useChatStore } from '@/stores/chat'
import type BaseChannel from '@/scripts/websocket/baseChannel'
import { useContactsStore } from '@/stores/contacts'
import SendForm from '@/components/Chat/SendForm.vue'
import type { Theme } from '@/types/chat'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { isApp } from '@/scripts/mobile/isApp'

const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const contacts = useContactsStore()
const connected = ref(false)
const connectionError = ref(false)
const theme = ref(null) as Ref<Theme | null>

const message = ref('')

const send = () => {
  ws.send('message', message.value)
  message.value = ''
}

const emoji = (emoji: string) => {
  ws.send('message', emoji)
}

const like = async (id: number) => {
  ws.send<{ message_id: number }>('message.like', '❤️', { message_id: id })
  if(isApp()) await Haptics.impact({ style: ImpactStyle.Light })
}

const chatID = `chat.${route.params.id as string}`
const ws = window.WS.channel(chatID)

const fetchChat = async () => {
  if (!(chatID in chat.messages)) {
    connected.value = false
    const res = await request.get(`/chat/${route.params.id as string}`)
    if (!res.data.$error) {
      const data = res.data as { group: { name: string; image_url: string }; messages: Messages }
      chat.push(chatID, data.messages)
      chat.profile[chatID] = {
        image: data.group.image_url,
        name: data.group.name,
        loading: false
      }
    } else return await router.push({ name: 'chat.contacts' })
  }

  ws.on<string>('connection', (data) => {
    console.info(`connection [${ws.uri}]:`, data)
  })

  ws.on<WSMessage>('message', (m) => {
    console.log(m)
    chat.push(chatID, [m])
    contacts.update(parseInt(route.params.id as string), m)
  })

  ws.on<Like>('message.like', (l) => {
    console.log(l)
    chat.pushLike(chatID, l?.message_id || 0, l)
  })

  ws.on<Like>('message.like.remove', (l) => {
    chat.removeLike(chatID, l?.message_id || 0, l)
  })

  ws.onStatusChange((chan: BaseChannel, is_connected: boolean) => {
    connected.value = is_connected
    connectionError.value = !is_connected
    console.log(is_connected, connectionError.value)
  })

  await ws.connect()
  connected.value = ws.isConnected()
  connectionError.value = !ws.isConnected()
}

onMounted(fetchChat)
onBeforeUnmount(() => {
  ws.disconnect()
})
</script>
