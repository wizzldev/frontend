<template>
  <ChatLayout
    :theme="theme?.top"
    :chat-profile="chat.profile[chatID] || { name: '', image: '', loading: true }"
    :isYou="storage.isYou"
  >
    <MessageLayout
      :theme="theme?.main"
      :isPM="isPM"
      :hasNext="cursors.nextCursor != ''"
      :messages="chat.messages[chatID] || []"
      @reply="handleReply"
      @load="loadMore"
      @modal="handleModal"
      @like="like"
      :canSendMessage="permission(Roles.SendMessage)"
    />
    <MessageForm
      v-if="chatReady"
      :theme="theme?.bottom"
      :reply="storage.replyMessage"
      :canSendMessage="permission(Roles.SendMessage)"
      :canAttachFile="permission(Roles.AttachFile)"
      @send="send"
      :edit="storage.editMessage"
      @detachReply="detachReply"
      @detachEdit="detachEdit"
      :emoji="emoji"
    />
  </ChatLayout>
  <MessageActionModal
    :canSendMessage="permission(Roles.SendMessage)"
    :canDeleteMessage="permission(Roles.DeleteMessage)"
    :canDeleteOtherMessage="permission(Roles.DeleteOtherMemberMessage)"
    :show="storage.modalMessage !== null"
    @close="storage.modalMessage = null"
    :msg="storage.modalMessage as WSMessage"
    @reply="replyTo"
    @delete="unSend"
    @edit="editMessage"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuth2Store } from '@/stores/auth2'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import ChatLayout from '@/layouts/ChatLayout.vue'
import MessageLayout from '@/components/Chat/MessageLayout.vue'
import MessageActionModal from '@/components/Modals/MessageActionModal.vue'
import MessageForm from '@/components/Chat/Form/MessageForm.vue'
import {
  fetchChatInfo,
  createChannel,
  createUnsentMessage,
  initChatStore,
  newReactiveStore
} from '@/views/Chat/scripts'
import { Roles } from '@/scripts/roles'
import type { Message as WSMessage, Messages } from '@/types/message'
import type { User } from '@/types/user'
import { isApp } from '@/scripts/mobile/isApp'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import request from '@/scripts/request/request'
import { resetTheme, setTheme } from '@/scripts/mobile/theme'
import { useLoader } from '@/stores/loader'
import { useLogger } from '@/stores/logger'

const loader = useLoader()
const auth = useAuth2Store()
const router = useRouter()
const route = useRoute()
const chat = useChatStore()
const toast = useToast()
const i18n = useI18n()
const { log: logger } = useLogger()

const log = (content: string) => {
  logger(`Chat[${route.params.id as string}]`, content)
}

const storage = newReactiveStore()

const chatID = computed(() => `chat.${route.params.id as string}`)
const theme = computed(() => chat.theme[chatID.value] || undefined)
const isPM = computed(() => chat.profile[chatID.value]?.pm || false)
const emoji = computed(() => chat.profile[chatID.value]?.emoji || '')
const cursors = computed(() => chat.cursors[chatID.value] || { nextCursor: '', prevCursor: '' })
const chatReady = ref(false)

const send = (content: string, data_json: string = '{}') => {
  const data = { reply_id: storage.replyMessage?.id }
  const hookID = ws()?.send('message', content, data)
  chat.push(
    chatID.value,
    [
      createUnsentMessage(
        auth.user as User,
        content,
        data_json,
        storage.replyMessage,
        hookID as string
      )
    ],
    null,
    true
  )
  storage.replyMessage = undefined
}

const permission = (role: string) => {
  return isPM.value || chat.roles[chatID.value]?.includes(role) || false
}

const like = async (id: number) => {
  ws()?.send<{ message_id: number }>('message.like', '❤️', { message_id: id })
  if (isApp()) await Haptics.impact({ style: ImpactStyle.Light })
}

const fetchChat = async (hard: boolean = false) => {
  if (!chat.shouldFetch(chatID.value) && !hard) return

  const data = await fetchChatInfo(route.params.id as string)
  if (!data) {
    await router.push({ name: 'chat.contacts' })
    return
  }

  storage.isYou = data.is_your_profile

  await nextTick()

  initChatStore(
    chatID.value,
    data.group,
    data.messages.data,
    data.user_roles,
    data.group.is_private_message,
    data.group.is_verified,
    data.group.emoji || '',
    data.messages.next_cursor,
    data.messages.previous_cursor
  )
}

const initWebsocket = () => {
  const chan = createChannel(route.params.id as string)
  chan.on<null>('reload', () => {
    mount(true)
    log('Reload event received')
  })
  window.WS.push(route.params.id as string, chan)
}

const loadMore = async () => {
  const next = cursors.value.nextCursor
  if (!next) return
  const res = await request.get(`/chat/${route.params.id as string}/paginate?cursor=${next}`)
  if (res.data.$error) {
    toast.error(i18n.t('Failed to load more messages'))
    return
  }

  const data = res.data as { next_cursor: string; previous_cursor: string; data: Messages }
  if (next !== '') chat.push(chatID.value, data.data)
  chat.cursors[chatID.value] = { nextCursor: data.next_cursor, prevCursor: data.previous_cursor }
}

const handleReply = (msg: WSMessage) => {
  storage.replyMessage = msg
}

const handleModal = (msg: WSMessage) => {
  storage.modalMessage = msg
}

const detachReply = () => {
  storage.replyMessage = undefined
}

const detachEdit = () => {
  storage.editMessage = null
}

const replyTo = (msg: WSMessage) => {
  storage.replyMessage = msg
  storage.modalMessage = null
}

const unSend = (msg: WSMessage) => {
  ws()?.send('message.delete', msg.id.toString())
}

const editMessage = (msg: WSMessage) => {
  storage.editMessage = msg
}

const ws = () => {
  return window.WS.get(route.params.id as string)
}

const mount = async (hard: boolean = false) => {
  await fetchChat(hard)
  chatReady.value = true
  if (theme.value) await setTheme(theme.value.top.bg || '', theme.value.bottom.bg || '')
}

onMounted(async () => {
  loader.loading = false
  await mount()
  initWebsocket()
})

onUnmounted(async () => {
  await resetTheme()
})
</script>
