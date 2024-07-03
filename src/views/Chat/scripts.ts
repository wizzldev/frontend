import { Channel } from '@/scripts/ws/channel'
import type { Like, Message as WSMessage, Message, Messages } from '@/types/message'
import { useChatStore } from '@/stores/chat'
import { useContactsStore } from '@/stores/contacts'
import request from '@/scripts/request/request'
import type { User } from '@/types/user'
import type { ThemeData } from '@/types/chat'
import { reactive } from 'vue'

export interface ChatData {
  user_roles: Array<string>
  group: {
    name: string
    image_url: string
    is_private_message: boolean
    theme: { id: number; name: string; data: string } | undefined
  }
  messages: { data: Messages; next_cursor: string; previous_cursor: string }
  is_your_profile: boolean
}

export const fetchChatInfo = async (id: string): Promise<ChatData | null> => {
  const res = await request.get(`/chat/${id}`)
  if (res.data.$error) return null
  return res.data as ChatData
}

export const createChannel = (id: string, chatID: string) => {
  const chat = useChatStore()
  const contacts = useContactsStore()

  const chan = new Channel(id)
  chan.on<Message>('message', (m, hookID) => {
    chat.push(chatID, [m], hookID, true)
    contacts.update(parseInt(id), m)
  })

  chan.on<Like>('message.like', (l) => {
    chat.pushLike(chatID, l?.message_id || 0, l)
  })

  chan.on<Like>('message.like.remove', (l) => {
    chat.removeLike(chatID, l?.message_id || 0, l)
  })

  chan.on<number>('message.unSend', (id) => {
    chat.rmMessageID(chatID, id)
  })

  return chan
}

export const createUnsentMessage = (
  user: User,
  content: string,
  data_json: string,
  reply: Message | undefined,
  hookID: string
): Message => {
  return {
    id: 0,
    sender: user,
    content: content,
    type: 'message',
    data_json: data_json,
    underSending: true,
    hookId: hookID,
    reply: reply
  } as Message
}

export const initChatStore = (
  id: string,
  group: { image_url: string; name: string; theme: { data: string } | undefined },
  messages: Messages,
  roles: Array<string>
) => {
  const chat = useChatStore()

  // set the last fetch date to now
  chat.lastFetch[id] = new Date()

  chat.isPM[id] = true
  chat.profile[id] = {
    image: group.image_url,
    name: group.name,
    loading: false
  }
  if (group.theme) chat.theme[id] = JSON.parse(group.theme.data) as ThemeData
  chat.push(id, messages)
  chat.setRoles(id, roles)
}

export const newReactiveStore = () => {
  return reactive<{
    modalMessage: WSMessage | null
    replyMessage: WSMessage | undefined
    cursors: { next: string; prev: string }
    isPM: boolean
    isYou: boolean
  }>({
    modalMessage: null,
    replyMessage: undefined,
    cursors: { next: '', prev: '' },
    isPM: true,
    isYou: false
  })
}
