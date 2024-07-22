import type { User } from '@/types/user'
import type { Roles } from '@/types/roles'

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
  underSending: boolean
  hookId: string
}

export interface Like {
  id: number
  emoji: string
  sender: User
  message_id: number | undefined
}

export type Messages = Array<Message>

export type MessageGroup = { type: string; sender: User; messages: Messages; roles?: Roles }
export type MessageGroupList = Array<MessageGroup>
