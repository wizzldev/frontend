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
      console.log(this.host)
      const c = new WebSocket(host ? host : this.host)

      c.onerror = window.WS.connector()
      c.onclose = window.WS.connector()
      c.onopen = () => {
        this.connected = true
        resolve(c)
      }
      c.onerror = () => {
        this.connected = false
        console.log('Something went wrong:', c, this)
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
    this.channels.forEach((ch) => {
      if (ch.ch.id == data.resource || ch.ch.id == 'global') ch.ch.dispatch<T>(data.message)
    })
  }

  public push(name: string, ch: Channel): Detach {
    const len = this.channels.push({ name, ch })
    return () => {
      delete this.channels[len - 1]
    }
  }

  public send(s: string) {
    console.log('Sending payload:', s)
    this.conn?.send(s)
  }

  public get(name: string): Channel | null {
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].name == name) return this.channels[i].ch
    }
    return null
  }
}
