import { Channel } from '@/scripts/ws/channel'
import type { Message, Messages } from '@/types/message'
import { useChatStore } from '@/stores/chat'
import request from '@/scripts/request/request'
import type { User } from '@/types/user'
import type { ThemeData } from '@/types/theme'
import { reactive } from 'vue'

export interface ChatData {
  user_roles: Array<string>
  group: {
    name: string
    image_url: string
    is_private_message: boolean
    theme: { id: number; name: string; data: string } | undefined
    is_verified: boolean
    emoji: string | null
  }
  messages: { data: Messages; next_cursor: string; previous_cursor: string }
  is_your_profile: boolean
}

export const fetchChatInfo = async (id: string): Promise<ChatData | null> => {
  const res = await request.get(`/chat/${id}`)
  if (res.data.$error) return null
  return res.data as ChatData
}

export const createChannel = (id: string) => new Channel(id)

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
    reply: reply,
    created_at: new Date().toString(),
  } as Message
}

export const initChatStore = (
  id: string,
  group: { image_url: string; name: string; theme: { data: string } | undefined },
  messages: Messages,
  roles: Array<string>,
  pm: boolean,
  is_verified: boolean,
  emoji: string,
  nextCursor: string,
  prevCursor: string,
) => {
  const chat = useChatStore()

  // set the last fetch date to now
  chat.lastFetch[id] = new Date()

  chat.profile[id] = {
    image: group.image_url,
    name: group.name,
    loading: false,
    pm,
    is_verified,
    emoji
  }
  if (group.theme) chat.theme[id] = JSON.parse(group.theme.data) as ThemeData
  chat.push(id, messages)
  chat.setRoles(id, roles)
  chat.cursors[id] = {nextCursor, prevCursor}
}

export const newReactiveStore = () => {
  return reactive({
  modalMessage: null as Message | null,
  replyMessage: undefined as Message | undefined,
  isYou: false,
  editMessage: null as Message | null,
})
}
