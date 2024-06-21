import Server from '@/scripts/websocket/server'
import type BaseChannel from '@/scripts/websocket/baseChannel'
import { WizzlDefaultChannel } from '@/scripts/consts'

const disconnectHandler = async (chan: BaseChannel) => {
  console.error(`Channel ${chan.uri} disconnected. Trying to reconnect...`)
  await chan.connect()
}

const setup = async (auth: string, force: boolean = false) => {
  if (window.WS != undefined || force) return
  window.WS = new Server(window.GLOBAL_ENV.WS_ENDPOINT, auth, disconnectHandler)
  const base = window.WS.channel(WizzlDefaultChannel)

  base.on<string>('connection', (s) => {
    console.info(`connection [${base.uri}]: ${s}`)
  })

  await base.connect()
  chanStatus()
}

const chanStatus = () => {
  window.WS.allChannel().forEach((chan) => {
    console.info(`${chan.name} - ${chan.isConnected()}`)
    chan.send('ping', 'ping')
  })
  setTimeout(chanStatus, 3000)
}

window.onbeforeunload = function () {
  if (!window.WS) return
  const channels = window.WS.allChannel()
  channels.forEach((chan) => chan.disconnect())
}

export default setup
