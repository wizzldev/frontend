import type { Channel } from '@/scripts/ws/channel'
import type { Detach, MessageWrapper } from '@/scripts/ws/types'

export default class Server {
  private readonly host: string
  private conn: WebSocket | null = null
  private channels: Array<{ name: string; ch: Channel }> = []

  public constructor(host: string) {
    this.host = host
  }

  public async connect() {
    let connected = false
    this.conn = await new Promise((resolve) => {
      const c = new WebSocket(this.host)
      c.onopen = () => {
        connected = true
        resolve(c)
      }
      c.onerror = () => {
        console.log('Something went wrong:', c)
        resolve(c)
      }
    })

    if (!connected || !this.conn) return false

    this.conn.onmessage = (e: MessageEvent<string>): void => {
      this.handle(e)
    }

    return true
  }

  private handle<T>(e: MessageEvent<string>): void {
    const data = JSON.parse(e.data) as MessageWrapper<T>
    this.channels.forEach((ch) => {
      if (ch.ch.id == data.resource) ch.ch.dispatch<T>(data.message)
    })
  }

  public push(name: string, ch: Channel): Detach {
    const len = this.channels.push({ name, ch })
    return () => {
      delete this.channels[len - 1]
    }
  }

  public send(s: string) {
    console.log('Sending payload', s)
    this.conn?.send(s)
  }

  public get(name: string): Channel | null {
    for (let i = 0; i < this.channels.length; i++) {
      if (this.channels[i].name == name) return this.channels[i].ch
    }
    return null
  }
}
