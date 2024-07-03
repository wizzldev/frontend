<template>
  <ChatLayout
    :theme="theme?.dark?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
    :isYou="isYou"
  >
    <MessageLayout
      :theme="theme?.dark?.main"
      :isPM="isPM"
      :hasNext="cursors.next != ''"
      :messages="chat.messages[chatID] || []"
      @reply="(msg) => (replyMessage = msg)"
      @load="loadMore"
      @modal="(msg: WSMessage) => (modalMessage = msg)"
      @like="like"
    />
    <MessageForm
      :theme="theme?.dark?.bottom"
      :reply="replyMessage"
      :canSendMessage="permission('SEND_MESSAGE')"
      :canAttachFile="permission('ATTACH_FILE')"
      @send="send"
      @detachReply="replyMessage = undefined"
    />
  </ChatLayout>
  <MessageActionModal
    :canDeleteMessage="permission('DELETE_MESSAGE')"
    :show="modalMessage != null"
    @close="modalMessage = null"
    :msg="modalMessage as WSMessage"
    @reply="replyTo"
    @delete="unSend"
  />
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Message as WSMessage, Messages } from '@/types/message'
import { useChatStore } from '@/stores/chat'
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
import MessageForm from '@/components/Chat/Form/MessageForm.vue'
import { fetchChatInfo, createChannel, createUnsentMessage } from '@/views/Chat/scripts'
import type { Detach } from '@/scripts/ws/types'
import type { User } from '@/types/user'

const auth = useAuthStore()
const loader = useRouteLoaderStore()
const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const toast = useToast()
const i18n = useI18n()
const theme = ref<Theme | null>(null)
const modalMessage = ref<WSMessage | null>(null)
const replyMessage = ref<WSMessage | undefined>(undefined)
const cursors = ref<{ next: string; prev: string }>({ next: '', prev: '' })
const isPM = ref(true)
const isYou = ref<boolean>(false)
const detachChan = ref<Detach | null>(null)

const send = (content: string, data_json: string = '{}') => {
  const data = {} as { reply_id: number | undefined }
  if (replyMessage.value) data.reply_id = replyMessage.value?.id
  const hookID = ws()?.send('message', content, data)
  chat.push(
    chatID.value,
    [
      createUnsentMessage(
        auth.user as User,
        content,
        data_json,
        replyMessage.value,
        hookID as string
      )
    ],
    null,
    true
  )
  replyMessage.value = undefined
}

const permission = (role: string) =>
  isPM.value || ((!chat.roles[chatID.value] || chat.roles[chatID.value]?.includes(role)) as boolean)

const like = async (id: number) => {
  ws()?.send<{ message_id: number }>('message.like', '❤️', { message_id: id })
  if (isApp()) await Haptics.impact({ style: ImpactStyle.Light })
}

const chatID = computed(() => `chat.${route.params.id as string}`)

const initWebsocket = () => {
  const chan = createChannel(route.params.id as string, chatID.value)

  chan.on<null>('reload', () => {
    mount(true)
  })

  detachChan.value = window.WS.push(route.params.id as string, chan)
}

const fetchChat = async (hard: boolean = false) => {
  if (!chat.shouldFetch(chatID.value) && !hard) return

  loader.isLoaded = false

  const data = await fetchChatInfo(route.params.id as string)
  if (!data) return await router.push({ name: 'chat.contacts' })

  // set the last fetch date to now
  chat.lastFetch[chatID.value] = new Date()

  isPM.value = data.group.is_private_message
  isYou.value = data.is_your_profile

  chat.isPM[chatID.value] = true
  chat.profile[chatID.value] = {
    image: data.group.image_url,
    name: data.group.name,
    loading: false
  }
  chat.push(chatID.value, data.messages.data)
  chat.setRoles(chatID.value, data.user_roles)

  cursors.value = { next: data.messages.next_cursor, prev: data.messages.previous_cursor }
  loader.isLoaded = true
}

const loadMore = async () => {
  const next = cursors.value.next || ''
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

const mount = async (hard: boolean = false) => {
  await fetchChat(hard)
  initWebsocket()
  if (theme.value != null)
    await setTheme(theme.value?.dark?.top.bg || '', theme.value?.dark?.bottom.bg || '')
}

onMounted(mount)

onUnmounted(async () => {
  await resetTheme()
  detachChan.value?.()
})
</script>
