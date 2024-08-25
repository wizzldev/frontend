import Server from './server'
import { Channel } from '@/scripts/ws/channel'
import { WizzlDefaultChannel } from '@/scripts/consts'
import { useChatStore } from '@/stores/chat'
import type { Like, Message } from '@/types/message'
import { useContactsStore } from '@/stores/contacts'
import { useLogger } from '@/stores/logger'

const log = (msg: string) => useLogger().log('WS', msg)

export const setup = async (auth: string, force: boolean = false) => {
  if (window.WS !== undefined && !force) return
  log('Initializing WebSocket connection...')

  window.WS = new Server(`${window.GLOBAL_ENV.WS_ENDPOINT}?authorization=${auth}`)

  const base = new Channel(WizzlDefaultChannel)
  base.on<string>('connection', ({ data }) => {
    console.debug(`[ws] connection: ${data}`)
  })

  base.on<string>('echo', ({ data }) => {
    console.debug('[ws] echo:', JSON.parse(data))
  })

  base.use(ping, 2500)
  window.WS.push(WizzlDefaultChannel, base)
  window.WS.push('global', createGlobal())

  log(`Connecting to our gateway ${window.GLOBAL_ENV.WS_ENDPOINT}`)
  await window.WS.connect()
}

const ping = (ch: Channel) => {
  ch.send('ping', 'ping')
}

const createGlobal = (): Channel => {
  const glob = new Channel('global')

  const chat = useChatStore()
  const contacts = useContactsStore()

  glob.on<Message>('message', ({ data, hookID, resource }) => {
    chat.push(chatID(resource), [data], hookID, true)
    contacts.update(parseInt(resource), data)
  })

  glob.on<Like>('message.like', ({ data, resource }) => {
    chat.pushLike(chatID(resource), data?.message_id || 0, data)
  })

  glob.on<Like>('message.like.remove', ({ data, resource }) => {
    chat.removeLike(chatID(resource), data?.message_id || 0, data)
  })

  glob.on<number>('message.unSend', ({ data: id, resource }) => {
    chat.rmMessageID(chatID(resource), id)
  })

  glob.on<string>('delete', ({ data: id }) => {
    contacts.removeByID(parseInt(id))
  })

  return glob
}

const chatID = (resource: string): string => {
  return `chat.${resource}`
}
