import Server from './server'
import { Channel } from '@/scripts/ws/channel'
import { WizzlDefaultChannel } from '@/scripts/consts'

export const setup = async (auth: string, force: boolean = false) => {
  if (window.WS != undefined || force) return
  window.WS = new Server(`${window.GLOBAL_ENV.WS_ENDPOINT}?authorization=${auth}`)

  const base = new Channel(WizzlDefaultChannel)
  base.on<string>('connection', (s) => {
    console.debug(`[ws] connection: ${s}`)
  })

  base.use(ping, 2500)
  window.WS.push(WizzlDefaultChannel, base)
  await window.WS.connect()
}

const ping = (ch: Channel) => {
  ch.send('ping', 'ping')
}
