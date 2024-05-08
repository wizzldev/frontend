<template>
  <ChatLayout :chat-profile="chatProfile">
    <main class="h-full flex space-y-3 overflow-y-scroll flex-col-reverse">
      <Message v-for="(msg, inx) in messages" :key="inx" :message="msg" />
    </main>
    <div class="border-t-2 border-t-secondary px-3 py-2 flex items-center space-x-2">
      <PushButton :is-link="false">Photo</PushButton>
      <form v-on:submit.prevent>
        <div class="relative">
          <input
            class="w-full bg-secondary pr-12 pl-4 py-2 rounded-xl"
            :placeholder="$t('Message') + '...'"
          />
          <div class="absolute inset-y-0 end-0 flex items-center pr-1.5 pointer-events-none">
            <button class="p-0.5 flex items-center justify-center">
              <Send class="text-gray-400" />
            </button>
          </div>
  </div>
      </form>
    </div>
  </ChatLayout>
</template>
<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Messages, Message as WSMessage } from '@/types/message'
import Message from '@/components/Chat/Message.vue'
import PushButton from '@/components/Elements/PushButton.vue'
import Send from '@/components/Icons/Send.vue'

const router = useRouter()
const route = useRoute()
const chatProfile = ref({ name: '', image: '', loading: true })
const messages = ref([]) as Ref<Messages>
const connected = ref(false)

const ws = window.WS.channel(`chat.${route.params.id as string}`)

const fetchChat = async () => {
  connected.value = false
  const res = await request.get(`/chat/${route.params.id as string}`)
  if(!res.data.$error) {
    const data = res.data as ({ group: {name: string; image_url: string;}; messages: Messages })
    chatProfile.value.image = data.group.image_url
    chatProfile.value.name = data.group.name
    chatProfile.value.loading = false
    messages.value = data.messages
  } else return await router.push({name: 'chat.contacts'})

  ws.on<string>('connection', (data) => {
    console.info(`connection [${ws.uri}]:`, data)
  })

  ws.on<WSMessage>('message', (data) => {
    console.log("msg event", data)
    messages.value = [data, ...messages.value]
  })

  await ws.connect()
  connected.value = true
}

onMounted(fetchChat)
onUnmounted(() => ws.disconnect())
</script>