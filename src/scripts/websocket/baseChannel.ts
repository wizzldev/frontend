import type {
  DetachEventListener,
  DisconnectHandler,
  MessageData,
  MessageHandler,
  messageHandlers,
  StatusChangeHandler
} from '@/scripts/websocket/types'

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
    if(window.WS.channel(this.name).connecting() || this.connectionInProgress) return
    if(window.WS.channel(this.name).isConnected() || this._isConnected) return
    if(this.terminated) return
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

  public log(...data: Array<unknown>) {
    console.info(`WS [${this.name}] - ${data.join(', ')}`)
  }

  public disconnect() {
    this.onDisconnect = async () => {
      console.log('Disconnected from ws')
      this._isConnected = false
    }
    this.messageHandlers.forEach((h, id) => {
      delete this.messageHandlers[id]
      this.log(`Handler ${h.event} detached`)
    })
    this.statusChange = () => {}
    for (let i = 0; i < this.messageHandlers.length; i++) delete this.messageHandlers[i]
    if(this.conn) this.conn.onclose = () => {}
    this.baseSend('close', 'close', null)
    if(this.conn?.readyState == WebSocket.OPEN) this.conn?.close()
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

  public onStatusChange(fn: StatusChangeHandler) {
    this.statusChange = fn
  }

  public job(
    name: string,
    msg: { type: string; content: string; data_json: string },
    timeout: number
  ) {
    if (name in this.jobs) return
    this.jobs.push(name)
    const finish = () =>
      setInterval(() => {
        this.baseSend(msg.type, msg.content, msg.data_json)
        console.log(`[WS] ${this.uri}: Task "${name}" finished`)
        if (!this._isConnected) return
        setInterval(() => finish, timeout)
      }, timeout)
    finish()
  }

  public terminate() {
    this.terminated = true
    this.disconnect()
  }
}

export default BaseChannel
