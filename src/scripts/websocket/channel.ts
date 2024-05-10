import type {
  DetachEventListener,
  DisconnectHandler,
  MessageHandler
} from '@/scripts/websocket/types'
import BaseChannel from '@/scripts/websocket/baseChannel'

class Channel extends BaseChannel {
  public constructor(host: string, auth: string, resource: string, d: DisconnectHandler) {
    super(host, auth, resource, d)
  }

  public on<T>(event: string, handle: MessageHandler<T>): DetachEventListener {
    console.info(`ws handler ${event} registered`)
    return this.eventListenerDetach<T>(event, handle)
  }

  public send<T>(type: string, content: string, dataJSON: T | null = null) {
    this.baseSend<T>(type, content, dataJSON)
  }
}

export default Channel
