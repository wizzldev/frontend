<template>
  <ChatLayout :chat-profile="chat.profile[chatID] || {name:'', image: '', loading: true}">
    <MessageList :messages="chat.messages[chatID] || []" />
      <div class="border-t-2 border-t-secondary px-3 py-2 flex items-center space-x-2" :class="{'!border-t-red-400': !connected}">
        <form class="w-full" v-on:submit.prevent="send">
          <div class="bg-secondary rounded-lg w-full flex items-center justify-between">
            <input
              type="text"
              class="resize-none bg-secondary rounded-lg py-2 px-3 w-full"
              v-model="message"
              :placeholder="$t('Message')"
              required
            />
            <button class="py-2 px-3 mt-auto">
              <Send />
            </button>
          </div>
        </form>
      </div>
  </ChatLayout>
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Messages, Message as WSMessage } from '@/types/message'
import Send from '@/components/Icons/Send.vue'
import MessageList from '@/components/Chat/MessageList.vue'
import { useChatStore } from '@/stores/chat'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import type BaseChannel from '@/scripts/websocket/baseChannel'
import { useContactsStore } from '@/stores/contacts'

const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const contacts = useContactsStore()
const i18n = useI18n()
const toast = useToast()
const connected = ref(false)

const message = ref('')

const send = () => {
  ws.send('message', message.value)
  message.value = ''
}

const chatID = `chat.${route.params.id as string}`
const ws = window.WS.channel(chatID)

const fetchChat = async () => {
  if(!(chatID in chat.messages)) {
    connected.value = false
    const res = await request.get(`/chat/${route.params.id as string}`)
    if (!res.data.$error) {
      const data = res.data as { group: { name: string; image_url: string }; messages: Messages }
      chat.push(chatID, data.messages)
      chat.profile[chatID] = {
        image: data.group.image_url,
        name: data.group.name,
        loading: false,
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

  ws.onStatusChange((chan: BaseChannel, is_connected: boolean) => {
    connected.value = is_connected
    if(!is_connected) toast.error(i18n.t('The real-time connection is lost'))
  })

  await ws.connect()
  if(ws.isConnected()) connected.value = true
  else toast.warning(i18n.t('Failed to connect to our real time server\'s'))
}

onMounted(fetchChat)
onBeforeUnmount(() => {
  ws.disconnect()
})
</script>
