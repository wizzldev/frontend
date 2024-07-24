<template>
  <ChatLayout
    :theme="theme?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
    :isYou="store.isYou"
  >
    <MessageLayout
      :theme="theme?.main"
      :isPM="isPM"
      :hasNext="store.cursors.next != ''"
      :messages="chat.messages[chatID] || []"
      @reply="(msg) => (store.replyMessage = msg)"
      @load="loadMore"
      @modal="(msg: WSMessage) => (store.modalMessage = msg)"
      @like="like"
    />
    <MessageForm
      :theme="theme?.bottom"
      :reply="store.replyMessage"
      :canSendMessage="permission(Roles.SendMessage)"
      :canAttachFile="permission(Roles.AttachFile)"
      @send="send"
      :edit="store.editMessage"
      @detachReply="store.replyMessage = undefined"
      @detachEdit="store.editMessage = null"
    />
  </ChatLayout>
  <MessageActionModal
    :canDeleteMessage="permission(Roles.DeleteMessage)"
    :canDeleteOtherMessage="permission(Roles.DeleteOtherMemberMessage)"
    :show="store.modalMessage != null"
    @close="store.modalMessage = null"
    :msg="store.modalMessage as WSMessage"
    @reply="replyTo"
    @delete="unSend"
    @edit="(msg: WSMessage) => (store.editMessage = msg)"
  />
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { computed, onMounted, onUnmounted } from 'vue'
import request from '@/scripts/request/request'
import { useRoute, useRouter } from 'vue-router'
import type { Message as WSMessage, Messages } from '@/types/message'
import { useChatStore } from '@/stores/chat'
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
import {
  fetchChatInfo,
  createChannel,
  createUnsentMessage,
  initChatStore,
  newReactiveStore
} from '@/views/Chat/scripts'
import type { User } from '@/types/user'
import { Roles } from '@/scripts/roles'

// using
const auth = useAuthStore()
const loader = useRouteLoaderStore()
const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const toast = useToast()
const i18n = useI18n()

// refs
const store = newReactiveStore()

const theme = computed(() => chat.theme[chatID.value] || undefined)

const send = (content: string, data_json: string = '{}') => {
  const data = {} as { reply_id: number | undefined }
  if (store.replyMessage) data.reply_id = store.replyMessage?.id
  const hookID = ws()?.send('message', content, data)
  chat.push(
    chatID.value,
    [
      createUnsentMessage(
        auth.user as User,
        content,
        data_json,
        store.replyMessage,
        hookID as string
      )
    ],
    null,
    true
  )
  store.replyMessage = undefined
}

const permission = (role: string) => {
  return (
    isPM.value ||
    ((!chat.roles[chatID.value] || chat.roles[chatID.value]?.includes(role)) as boolean)
  )
}

const isPM = computed(() => chat.profile[chatID.value] && chat.profile[chatID.value].pm)

const like = async (id: number) => {
  ws()?.send<{ message_id: number }>('message.like', '❤️', { message_id: id })
  if (isApp()) await Haptics.impact({ style: ImpactStyle.Light })
}

const chatID = computed(() => `chat.${route.params.id as string}`)

const fetchChat = async (hard: boolean = false) => {
  if (!chat.shouldFetch(chatID.value) && !hard) return

  loader.isLoaded = false

  const data = await fetchChatInfo(route.params.id as string)
  if (!data) {
    await router.push({ name: 'chat.contacts' })
    loader.isLoaded = true
    return
  }

  store.isYou = data.is_your_profile

  initChatStore(
    chatID.value,
    data.group,
    data.messages.data,
    data.user_roles,
    data.group.is_private_message,
    data.group.is_verified
  )
  store.cursors = { next: data.messages.next_cursor, prev: data.messages.previous_cursor }
  loader.isLoaded = true
}

const initWebsocket = () => {
  const chan = createChannel(route.params.id as string)

  chan.on<null>('reload', () => {
    mount(true)
    toast.info(i18n.t('Chat successfully reloaded'))
  })

  window.WS.push(route.params.id as string, chan)
}

const loadMore = async () => {
  const next = store.cursors.next
  const res = await request.get(`/chat/${route.params.id as string}/paginate?cursor=${next}`)
  if (res.data.$error) {
    toast.error(i18n.t('Failed to load more messages'))
    return
  }

  const data = res.data as { next_cursor: string; previous_cursor: string; data: Messages }
  if (next != '') chat.push(chatID.value, data.data)
  store.cursors = { next: data.next_cursor, prev: data.previous_cursor }
}

const replyTo = (msg: WSMessage) => {
  store.replyMessage = msg
  store.modalMessage = null
}

const unSend = (msg: WSMessage) => {
  ws()?.send('message.delete', msg.id.toString())
}

const ws = () => {
  return window.WS.get(route.params.id as string)
}

const mount = async (hard: boolean = false) => {
  await fetchChat(hard)
  if (theme.value != undefined)
    await setTheme(theme.value?.top.bg || '', theme.value?.bottom.bg || '')
}

onMounted(async () => {
  await mount()
  initWebsocket()
})

onUnmounted(async () => {
  await resetTheme()
})
</script>
