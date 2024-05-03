import type {
  DetachEventListener,
  DisconnectHandler,
  MessageData,
  MessageHandler,
  messageHandlers
} from '@/scripts/websocket/types'

class BaseChannel {
  public readonly uri: string
  protected onDisconnect: DisconnectHandler
  protected conn: WebSocket | null = null
  private messageHandlers: messageHandlers = []
  private _isConnected = false

  public constructor(host: string, auth: string, resource: string, d: DisconnectHandler) {
    this.uri = `${host}/${resource.replace('.', '/')}?authorization=${auth}`
    this.onDisconnect = d
  }

  public async connect() {
    this.conn = await new Promise((resolve) => {
      const c = new WebSocket(this.uri)
      c.onopen = () => {
        resolve(c)
      }
    })

    this.conn?.addEventListener('error', async () => {
      await this.error()
    })
    this.conn?.addEventListener('close', async () => {
      await this.error()
    })
    this.conn?.addEventListener('message', (e: MessageEvent<string>): void => {
      this.handle(e)
    })
    this.conn?.addEventListener('open', () => {
      this._isConnected = true
    })
  }

  public isConnected(): boolean {
    return this._isConnected
  }

  public disconnect() {
    for (let i = 0; i < this.messageHandlers.length; i++) delete this.messageHandlers[i]
    this.onDisconnect = async () => {}
    this.conn?.close()
  }

  public async error() {
    if (!this._isConnected) {
      await this.onDisconnect(this)
    }
  }

  protected eventListenerDetach<T>(event: string, handler: MessageHandler<T>): DetachEventListener {
    const len = this.messageHandlers.push({ event, handler })
    return () => {
      delete this.messageHandlers[len - 1]
    }
  }

  protected handle<T>(e: MessageEvent<string>) {
    const data = JSON.parse(e.data) as MessageData<T>
    this.messageHandlers.forEach((h) => {
      if (h.event == data.event) {
        h.handler(data.data)
      }
    })
  }

  protected baseSend<T>(type: string, content: string, data_json: T | object | null) {
    if (data_json === null) data_json = {}
    const payload: { type: string; content: string; data_json: string } = {
      type,
      content,
      data_json: JSON.stringify(data_json)
    }
    const payloadString = JSON.stringify(payload)
    console.log('[WS]: Payload sent:', payloadString)
    this.conn?.send(payloadString)
  }
}

export default BaseChannel
