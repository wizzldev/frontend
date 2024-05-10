import type { channels, DisconnectHandler } from '@/scripts/websocket/types'
import Channel from '@/scripts/websocket/channel'

class Server {
  private host: string
  private auth: string
  private onDisconnect: DisconnectHandler
  private channels: channels = {}

  public constructor(host: string, auth: string, d: DisconnectHandler) {
    this.host = host
    this.auth = auth
    this.onDisconnect = d
  }

  public modifyDefaults(host: string, auth: string, d: DisconnectHandler) {
    this.host = host
    this.auth = auth
    this.onDisconnect = d
  }

  public channel(name: string = ''): Channel {
    if (Object.keys(this.channels).includes(name)) {
      return this.channels[name]
    }
    const chan = new Channel(this.host, this.auth, name, this.onDisconnect)
    this.channels[name] = chan
    return chan
  }

  public resetChannel(name: string): Channel {
    delete this.channels[name]
    return this.channel(name)
  }

  public logChannels() {
    console.log(this.channels)
  }
}

export default Server
