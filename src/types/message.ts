import type { User } from '@/types/user'

export interface Message {
  id: number
  sender: User
  content: string
  type: string
  data_json: string | null
  reply: Message | undefined
  created_at: string
  updated_at: string
  likes: Array<Like>
}

export interface Like {
  id: number
  emoji: string
  sender: User
  message_id: number | undefined
}

export type Messages = Array<Message>

export type MessageGroup = { type: string; sender: User; messages: Messages }
export type MessageGroupList = Array<MessageGroup>
