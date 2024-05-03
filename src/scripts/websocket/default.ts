import Server from '@/scripts/websocket/server'
import type BaseChannel from '@/scripts/websocket/baseChannel'
import { WizzlDefaultChannel } from '@/scripts/consts'

const disconnectHandler = async (chan: BaseChannel) => {
  console.error(`Channel ${chan.uri} disconnected. Trying to reconnect...`)
  await chan.connect()
}

const setup = async (auth: string) => {
  if (window.WS != undefined) return
  window.WS = new Server(window.GLOBAL_ENV.WS_ENDPOINT, auth, disconnectHandler)
  const base = window.WS.channel(WizzlDefaultChannel)
  await base.connect()

  base.on<string>('connection', (s) => {
    console.info(`connection [${base.uri}]: ${s}`)
  })
}

window.onbeforeunload = function () {
  if (!window.WS) return
  const chan = window.WS.channel(WizzlDefaultChannel)
  chan.disconnect()
}

export default setup
