<template>
  <ChatLayout
    :theme="theme?.dark?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
    :connection="{ connected, error: connectionError }"
  >
    <MessageLayout :hasNext="cursors == null || cursors.next != ''" @load="loadMore" @modal="(msg: WSMessage) => modalMessage = msg" @like="like" :theme="theme?.dark?.main" :messages="chat.messages[chatID] || []" />
    <SendForm :reply="replyMessage" @detachReply="replyMessage = null" :allowed="sendMessagePermission" :value="message" :theme="theme?.dark?.bottom" v-model="message" @send="send" @emoji="emoji" />
  </ChatLayout>
  <MessageActionModal :show="modalMessage != null" @close="modalMessage = null" :msg="modalMessage as WSMessage" @reply="replyTo" />
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
import MessageActionModal from '@/components/Modals/MessageActionModal.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const loader = useRouteLoaderStore()
const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const contacts = useContactsStore()
const toast = useToast()
const i18n = useI18n()
const connected = ref(false)
const connectionError = ref(false)
const theme = ref(null) as Ref<Theme | null>
const message = ref('')
let ws: Channel|undefined
const modalMessage = ref(null) as Ref<null | WSMessage>
const replyMessage = ref(null) as Ref<null | WSMessage>
const cursors = ref(null) as Ref<{next: string, prev: string} | null>

const send = () => {
  const data = {} as {reply_id: number|undefined}
  if(replyMessage.value != null) data.reply_id = replyMessage.value?.id
  const hookID = ws?.send('message', message.value, data)
  console.log("PUSHING UNSENT MESSAGES WITH HOOK ID:", hookID)
  chat.push(chatID, [{
    id: 0,
    sender: auth.user,
    content: message.value,
    type: 'message',
    data_json: '{}',
    underSending: true,
    hookId: hookID,
    reply: replyMessage.value || undefined
  } as WSMessage], null, true)
  message.value = ''
  replyMessage.value = null
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
  } as WSMessage], null, true)
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
    chat.push(chatID, [m], hookID, true)
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
      const data = res.data as { user_roles: Array<string>; group: { name: string; image_url: string }; messages: {data: Messages; next_cursor: string; previous_cursor: string};  }
      console.log("CURSORS", cursors.value)
      console.log("UPDATING CURSORS")
      cursors.value = {next: data.messages.next_cursor, prev: data.messages.previous_cursor}
      console.log("CURSORS", cursors.value)
      chat.isPM[chatID] = true
      chat.push(chatID, data.messages.data)
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

const loadMore = async () => {
  const next = cursors.value?.next || ''
  if(next == '') console.log('CURSOR IS EMPTYYY')
  const res = await request.get(`/chat/${route.params.id as string}/paginate?cursor=${next}`)
  if (res.data.$error) {
    toast.error(i18n.t('Failed to load more messages'))
    return
  }
  const data = res.data as {next_cursor: string, previous_cursor: string, data: Messages}
  if(next != '') chat.push(chatID, data.data)
  cursors.value = {next: data.next_cursor, prev: data.previous_cursor}
}

const replyTo = (msg: WSMessage) => {
  replyMessage.value = msg
  modalMessage.value = null
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
