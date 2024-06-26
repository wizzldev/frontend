import type {
  DetachEventListener,
  DisconnectHandler,
  MessageData,
  MessageHandler,
  messageHandlers,
  StatusChangeHandler
} from '@/scripts/websocket/types'
import { xxHash32 } from 'js-xxhash'

class BaseChannel {
  public readonly uri: string
  public readonly name: string
  protected onDisconnect: DisconnectHandler
  protected statusChange: StatusChangeHandler
  protected conn: WebSocket | null = null
  private messageHandlers: messageHandlers = []
  private connectionInProgress = false
  private _isConnected = false
  private jobs = [] as Array<string>
  private terminated = false

  public constructor(host: string, auth: string, resource: string, d: DisconnectHandler) {
    this.name = resource
    this.uri = `${host}/${resource.replace('.', '/')}?authorization=${auth}`
    this.onDisconnect = d
    this.statusChange = () => {}
  }

  public connecting() {
    return this.connectionInProgress
  }

  public async connect() {
    if (this.terminated) return
    if (window.WS.channel(this.name).connecting() || this.connectionInProgress) return
    if (window.WS.channel(this.name).isConnected() || this._isConnected) return
    this.connectionInProgress = true
    this.conn = await new Promise((resolve) => {
      const c = new WebSocket(this.uri)
      c.onopen = () => {
        this.connectionInProgress = false
        this._isConnected = true
        this.statusChange(this, true)
        resolve(c)
      }
      c.onerror = () => {
        console.log('Something went wrong:', c)
        resolve(c)
      }
    })

    this.conn?.addEventListener('open', async () => {
      this._isConnected = true
      this.statusChange(this, true)
    })
    this.conn?.addEventListener('error', async () => {
      await this.error()
    })
    this.conn?.addEventListener('close', async () => {
      this.statusChange(this, false)
      this._isConnected = false
      await this.error()
    })
    this.conn?.addEventListener('message', (e: MessageEvent<string>): void => {
      this.handle(e)
    })
  }

  public isConnected(): boolean {
    return this._isConnected
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public log(..._: Array<unknown>) {
    return
  }

  public disconnect() {
    if (this.terminated) return
    this.terminated = true
    this.onDisconnect = async () => {
      console.log('Disconnected from ws')
      this._isConnected = false
    }
    this.messageHandlers = []
    this.statusChange = () => {}
    if (this.conn) this.conn.onclose = () => {}
    this.baseSend('close', 'close', null)
    if (this.conn?.readyState != WebSocket.CLOSED) this.conn?.close()
    window.WS.detach(this.name)
  }

  public async error() {
    this.statusChange(this, false)
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
        h.handler(data.data, data.hook_id)
      }
    })
  }

  protected baseSend<T>(type: string, content: string, data_json: T | object | null): string {
    if (data_json === null) data_json = {}
    console.log('send', type, content, data_json)
    const hook = type == 'close' ? '' : this.newHookID(content)
    const payload: { type: string; content: string | number; data_json: string; hook_id: string } =
      {
        type,
        content,
        data_json: JSON.stringify(data_json),
        hook_id: hook
      }
    const payloadString = JSON.stringify(payload)
    this.conn?.send(payloadString)
    return hook
  }

  protected newHookID(s: string) {
    console.log(s)
    let id = 'hookID'
    try {
      id = xxHash32(s + Math.random().toString(16), Date.now()).toString(16)
    } catch (e) {
      console.error('Failed to generate new hookID', e)
    }
    return id
  }

  public onStatusChange(fn: StatusChangeHandler) {
    this.statusChange = fn
  }

  public WS(): WebSocket | null {
    return this.conn
  }
}

export default BaseChannel
