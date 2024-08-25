import type { Channel } from '@/scripts/ws/channel'
import type { Detach, MessageWrapper } from '@/scripts/ws/types'

export default class Server {
  public connected = false
  private readonly host: string
  private conn: WebSocket | null = null
  private channels: Array<{ name: string; ch: Channel }> = []

  public constructor(host: string) {
    this.host = host
  }

  public async connect(host: string | undefined = undefined) {
    this.connected = false
    this.conn = await new Promise((resolve) => {
      const c = new WebSocket(host ? host : this.host)

      c.onerror = window.WS.connector()
      c.onclose = window.WS.connector()
      c.onopen = () => {
        this.connected = true
        resolve(c)
      }
      c.onerror = () => {
        this.connected = false
        console.error('Something went wrong:', c, this)
        resolve(c)
      }
    })

    if (!this.connected || !this.conn) return false

    this.conn.onmessage = (e: MessageEvent<string>): void => {
      this.handle(e)
    }

    return true
  }

  public connector() {
    const host = this.host
    return () => {
      window.WS.connected = false
      setTimeout(async () => {
        await window.WS.connect(host)
      }, 1000)
    }
  }

  private handle<T>(e: MessageEvent<string>): void {
    const data = JSON.parse(e.data) as MessageWrapper<T>
    const log = [] as Array<any>
    this.channels.forEach((ch) => {
      log.push({
        ch: ch.name,
        id: ch.ch.id,
        sent: ch.ch.id == data.resource || ch.ch.id == 'global'
      })
      if (ch.ch.id == data.resource || ch.ch.id == 'global')
        ch.ch.dispatch<T>(data.message, data.resource)
    })
    console.debug(`[WS] Data Received and sent to channels:`, log)
  }

  public push(name: string, ch: Channel): Detach {
    console.debug(`[WS] Registering channel ${name}`)
    let inx = this.getChannelIndex(name)
    if (inx == -1) {
      this.channels.push({ name, ch })
      inx = this.channels.length - 1
    } else this.channels[inx] = { name, ch }
    return () => {
      console.debug(`[WS] Detaching channel: ${name}`)
      if (inx > -1) this.channels.splice(inx, 1)
    }
  }

  private getChannelIndex(name: string): number {
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].name == name) return i
    }
    return -1
  }

  public send(s: string) {
    this.conn?.send(s)
  }

  public get(name: string): Channel | null {
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].name == name) return this.channels[i].ch
    }
    return null
  }

  public disconnect() {
    this.conn?.close()
    this.connected = false
  }
}
