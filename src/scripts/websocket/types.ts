// handle an event
import type Channel from '@/scripts/websocket/channel'
import type BaseChannel from '@/scripts/websocket/baseChannel'

export type MessageData<T> = {
  event: string
  data: T
}

export type MessageHandler<T> = (data: T) => void

// removes an event listener
export type DetachEventListener = () => void

// handle when the socket disconnected
export type DisconnectHandler = (chan: BaseChannel) => Promise<void>

export type StatusChangeHandler = (chan: BaseChannel, connected: boolean) => void

export interface channels {
  [key: string]: Channel
}

export type messageHandlers = Array<{ event: string; handler: MessageHandler<any> }>
