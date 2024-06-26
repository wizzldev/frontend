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
    this.channels[name] = new Channel(this.host, this.auth, name, this.onDisconnect)
    return this.channels[name]
  }

  public allChannel(): Array<Channel> {
    return Object.values(this.channels)
  }

  public resetChannel(name: string): Channel {
    this.channels[name].disconnect()
    delete this.channels[name]
    return this.channel(name)
  }

  public detach(name: string) {
    this.channels[name].disconnect()
    delete this.channels[name]
  }
}

export default Server
