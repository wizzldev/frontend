import type { Channel } from '@/scripts/ws/channel'

export type MessageData<T> = {
  event: string
  data: T
  hook_id: string
}

export type MessageWrapper<T> = {
  message: MessageData<T>
  resource: string
}

export type PayloadWrapper = {
  message: Payload
  resource: string
}

export type Payload = {
  type: string
  content: string
  data_json: string
  hook_id: string
}

export type MessageHandler<T> = (ctx: {data: T; hookID: string, channel: Channel}) => void

// removes an event listener
export type Detach = () => void

// handle when the socket disconnected
export interface channels {
  [key: string]: Channel
}

export type Handler = { event: string; handler: MessageHandler<any> }
