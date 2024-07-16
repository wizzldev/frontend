import type {
  Detach,
  Handler,
  MessageData,
  MessageHandler,
  PayloadWrapper
} from '@/scripts/ws/types'
import { xxHash32 } from 'js-xxhash'

type useFunc = (ch: Channel) => void

export class Channel {
  public readonly id: string
  private handlers: Array<Handler> = []

  public constructor(id: string) {
    this.id = id
  }

  public use(fn: useFunc, interval: number) {
    setTimeout(() => {
      fn(this)
      this.use(fn, interval)
    }, interval)
  }

  public send<T>(type: string, content: string, dataJSON: T | null = null) {
    const data_json = dataJSON != null ? JSON.stringify(dataJSON) : '{}'
    const hookID = this.newHookID(content)
    const payload = {
      resource: this.id,
      message: {
        type,
        content,
        data_json,
        hook_id: hookID
      }
    } as PayloadWrapper
    window.WS.send(JSON.stringify(payload))
    return hookID
  }

  public on<T>(event: string, handler: MessageHandler<T>): Detach {
    const len = this.handlers.push({ event, handler })
    return () => {
      delete this.handlers[len - 1]
    }
  }

  protected newHookID(s: string) {
    let id = 'hookID'
    try {
      id = xxHash32(s + Math.random().toString(16), Date.now()).toString(16)
    } catch (e) {
      console.error('Failed to generate new hookID', e)
    }
    return id
  }

  public dispatch<T>(data: MessageData<T>, resource: string) {
    this.handlers.forEach((h) => {
      if (h.event == data.event) {
        h.handler({ data: data.data, hookID: data.hook_id, channel: this, resource })
      }
    })
  }
}
