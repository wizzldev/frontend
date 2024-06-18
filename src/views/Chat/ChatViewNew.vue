<template>
  <ChatLayout
    :theme="theme?.dark?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
    :connection="{ connected, error: connectionError }"
  >
    <MessageLayout @modal="(msg: WSMessage) => modalMessage = msg" @like="like" :theme="theme?.dark?.main" :messages="chat.messages[chatID] || []" />
    <SendForm :reply="replyMessage" @noReply="replyMessage = null" :allowed="sendMessagePermission" :value="message" :theme="theme?.dark?.bottom" v-model="message" @send="send" @emoji="emoji" />
  </ChatLayout>
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { computed, onBeforeUnmount, onMounted, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Like, Message as WSMessage, Messages } from '@/types/message'
import { useChatStore } from '@/stores/chat'
import type BaseChannel from '@/scripts/websocket/baseChannel'
import { useContactsStore } from '@/stores/contacts'
import SendForm from '@/components/ChatV1/SendForm.vue'
import type { Theme } from '@/types/chat'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { isApp } from '@/scripts/mobile/isApp'
import { useRouteLoaderStore } from '@/stores/routeLoader'
import type Channel from '@/scripts/websocket/channel'
import { resetTheme, setTheme } from '@/scripts/mobile/theme'
import { useAuthStore } from '@/stores/auth'
import MessageLayout from '@/components/Chat/MessageLayout.vue'

const auth = useAuthStore()
const loader = useRouteLoaderStore()
const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const contacts = useContactsStore()
const connected = ref(false)
const connectionError = ref(false)
const theme = ref(null) as Ref<Theme | null>
const message = ref('')
let ws: Channel|undefined
const modalMessage = ref(null) as Ref<null | WSMessage>
const replyMessage = ref(null) as Ref<null | WSMessage>

const send = () => {
  const hookID = ws?.send('message', message.value)
  console.log("PUSHING UNSENT MESSAGES WITH HOOK ID:", hookID)
  chat.push(chatID, [{
    id: 0,
    sender: auth.user,
    content: message.value,
    type: 'message',
    data_json: '{}',
    underSending: true,
    hookId: hookID,
  } as WSMessage])
  message.value = ''
}

const emoji = (emoji: string) => {
  const hookID = ws?.send('message', emoji)
  chat.push(chatID, [{
    id: 0,
    sender: auth.user,
    content: emoji,
    type: 'message',
    data_json: '{}',
    underSending: true,
    hookId: hookID,
  } as WSMessage])
}

const sendMessagePermission = computed(() => (!chat.roles[chatID] || chat.roles[chatID]?.includes('SEND_MESSAGE')) as boolean)

const like = async (id: number) => {
  ws?.send<{ message_id: number }>('message.like', '❤️', { message_id: id })
  if(isApp()) await Haptics.impact({ style: ImpactStyle.Light })
}

const chatID = `chat.${route.params.id as string}`

const initWebsocket = async () => {
  ws = window.WS.channel(chatID)

  if(ws.isConnected() || ws.WS()?.readyState == WebSocket.OPEN || ws.WS()?.readyState == WebSocket.CONNECTING) return

  ws.on<string>('connection', (data) => {
    console.info(`chat connection [${ws?.uri}]:`, data)
  })

  ws.on<WSMessage>('message', (m, hookID) => {
    console.log(m, hookID)
    chat.push(chatID, [m], hookID)
    contacts.update(parseInt(route.params.id as string), m)
  })

  ws.on<Like>('message.like', (l) => {
    console.log("LIKE:", l)
    chat.pushLike(chatID, l?.message_id || 0, l)
  })

  ws.on<Like>('message.like.remove', (l) => {
    chat.removeLike(chatID, l?.message_id || 0, l)
  })

  ws.onStatusChange((chan: BaseChannel, is_connected: boolean) => {
    connected.value = is_connected
    connectionError.value = !is_connected
  })

  await ws.connect()
  connected.value = ws?.isConnected()
  connectionError.value = !ws.isConnected()
}

const fetchChat = async () => {
  if (chat.shouldFetch(chatID)) {
    connected.value = false
    loader.isLoaded = false
    const res = await request.get(`/chat/${route.params.id as string}`)
    if (!res.data.$error) {
      const data = res.data as { user_roles: Array<string>; group: { name: string; image_url: string }; messages: Messages;  }
      chat.isPM[chatID] = true
      chat.push(chatID, data.messages)
      chat.setRoles(chatID, data.user_roles)
      chat.profile[chatID] = {
        image: data.group.image_url,
        name: data.group.name,
        loading: false
      }
      loader.isLoaded = true
    } else return await router.push({ name: 'chat.contacts' })
  }
}

onMounted(async () => {
  await fetchChat()
  await initWebsocket()
  if(theme.value != null) await setTheme(theme.value?.dark?.top.bg || '', theme.value?.dark?.bottom.bg || '')
})

onBeforeUnmount(async () => {
  if(ws) ws.disconnect()
  await resetTheme()
})
</script>
