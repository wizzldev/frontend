<template>
  <ChatLayout
    :theme="theme?.dark?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
  >
    <MessageLayout
      :isPM="isPM"
      @reply="(msg) => (replyMessage = msg)"
      :hasNext="cursors == null || cursors.next != ''"
      @load="loadMore"
      @modal="(msg: WSMessage) => (modalMessage = msg)"
      @like="like"
      :theme="theme?.dark?.main"
      :messages="chat.messages[chatID] || []"
    />
    <SendForm
      @uploadStarted="handleUpload"
      :reply="replyMessage"
      @detachReply="replyMessage = null"
      :allowed="sendMessagePermission"
      :value="message"
      :theme="theme?.dark?.bottom"
      v-model="message"
      @send="send"
      @emoji="emoji"
    />
  </ChatLayout>
  <MessageActionModal
    :show="modalMessage != null"
    @close="modalMessage = null"
    :msg="modalMessage as WSMessage"
    @reply="replyTo"
    @delete="unSend"
  />
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { computed, onMounted, onUnmounted, type Ref, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Like, Message as WSMessage, Messages } from '@/types/message'
import { useChatStore } from '@/stores/chat'
import { useContactsStore } from '@/stores/contacts'
import SendForm from '@/components/ChatV1/SendForm.vue'
import type { Theme } from '@/types/chat'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { isApp } from '@/scripts/mobile/isApp'
import { useRouteLoaderStore } from '@/stores/routeLoader'
import { resetTheme, setTheme } from '@/scripts/mobile/theme'
import { useAuthStore } from '@/stores/auth'
import MessageLayout from '@/components/Chat/MessageLayout.vue'
import MessageActionModal from '@/components/Modals/MessageActionModal.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { Channel } from '@/scripts/ws/channel'

const auth = useAuthStore()
const loader = useRouteLoaderStore()
const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const contacts = useContactsStore()
const toast = useToast()
const i18n = useI18n()
const theme = ref(null) as Ref<Theme | null>
const message = ref('')
const modalMessage = ref(null) as Ref<null | WSMessage>
const replyMessage = ref(null) as Ref<null | WSMessage>
const cursors = ref(null) as Ref<{ next: string; prev: string } | null>
const isPM = ref(true)

const send = () => {
  const data = {} as { reply_id: number | undefined }
  if (replyMessage.value != null) data.reply_id = replyMessage.value?.id
  const hookID = ws()?.send('message', message.value, data)
  console.log('senddddd', ws())
  chat.push(
    chatID.value,
    [
      {
        id: 0,
        sender: auth.user,
        content: message.value,
        type: 'message',
        data_json: '{}',
        underSending: true,
        hookId: hookID,
        reply: replyMessage.value || undefined
      } as WSMessage
    ],
    null,
    true
  )
  message.value = ''
  replyMessage.value = null
}

const handleUpload = (hookID: string) => {
  const data = {} as { reply_id: number | undefined }
  if (replyMessage.value != null) data.reply_id = replyMessage.value?.id
  chat.push(
    chatID.value,
    [
      {
        id: 0,
        sender: auth.user,
        content: message.value,
        type: 'file:file',
        data_json: `{}`,
        underSending: true,
        hookId: hookID,
        reply: replyMessage.value || undefined
      } as WSMessage
    ],
    null,
    true
  )
  replyMessage.value = null
}

const emoji = (emoji: string) => {
  const hookID = ws()?.send('message', emoji)
  chat.push(
    chatID.value,
    [
      {
        id: 0,
        sender: auth.user,
        content: emoji,
        type: 'message',
        data_json: '{}',
        underSending: true,
        hookId: hookID
      } as WSMessage
    ],
    null,
    true
  )
}

const sendMessagePermission = computed(
  () => (!chat.roles[chatID.value] || chat.roles[chatID.value]?.includes('SEND_MESSAGE')) as boolean
)

const like = async (id: number) => {
  ws()?.send<{ message_id: number }>('message.like', '❤️', { message_id: id })
  if (isApp()) await Haptics.impact({ style: ImpactStyle.Light })
}

const chatID = computed(() => `chat.${route.params.id as string}`)

const initWebsocket = () => {
  const chan = new Channel(route.params.id as string)
  chan.on<WSMessage>('message', (m, hookID) => {
    chat.push(chatID.value, [m], hookID, true)
    contacts.update(parseInt(route.params.id as string), m)
  })

  chan.on<Like>('message.like', (l) => {
    chat.pushLike(chatID.value, l?.message_id || 0, l)
  })

  chan.on<Like>('message.like.remove', (l) => {
    chat.removeLike(chatID.value, l?.message_id || 0, l)
  })

  chan.on<number>('message.unSend', (id) => {
    chat.rmMessageID(chatID.value, id)
  })

  window.WS.push(route.params.id as string, chan)
}

const fetchChat = async () => {
  if (chat.shouldFetch(chatID.value)) {
    loader.isLoaded = false
    const res = await request.get(`/chat/${route.params.id as string}`)
    if (!res.data.$error) {
      const data = res.data as {
        user_roles: Array<string>
        group: { name: string; image_url: string; is_private_message: boolean }
        messages: { data: Messages; next_cursor: string; previous_cursor: string }
      }
      cursors.value = { next: data.messages.next_cursor, prev: data.messages.previous_cursor }
      chat.isPM[chatID.value] = true
      chat.push(chatID.value, data.messages.data)
      chat.setRoles(chatID.value, data.user_roles)
      chat.profile[chatID.value] = {
        image: data.group.image_url,
        name: data.group.name,
        loading: false
      }
      isPM.value = data.group.is_private_message
      loader.isLoaded = true
    } else return await router.push({ name: 'chat.contacts' })
  }
}

const loadMore = async () => {
  const next = cursors.value?.next || ''
  if (next == '') console.log('CURSOR IS EMPTYYY')
  const res = await request.get(`/chat/${route.params.id as string}/paginate?cursor=${next}`)
  if (res.data.$error) {
    toast.error(i18n.t('Failed to load more messages'))
    return
  }
  const data = res.data as { next_cursor: string; previous_cursor: string; data: Messages }
  if (next != '') chat.push(chatID.value, data.data)
  cursors.value = { next: data.next_cursor, prev: data.previous_cursor }
}

const replyTo = (msg: WSMessage) => {
  replyMessage.value = msg
  modalMessage.value = null
}

const unSend = (msg: WSMessage) => {
  ws()?.send('message.delete', msg.id.toString())
}

const ws = () => {
  return window.WS.get(route.params.id as string)
}

onMounted(async () => {
  await fetchChat()
  initWebsocket()
  if (theme.value != null)
    await setTheme(theme.value?.dark?.top.bg || '', theme.value?.dark?.bottom.bg || '')
})

onUnmounted(async () => {
  await resetTheme()
})
</script>
