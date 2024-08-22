import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Like, Messages } from '@/types/message'
import type { ThemeData } from '@/types/chat'

interface Storage {
  isPM: Record<string, boolean>
  messages: Record<string, Messages>
  roles: Record<string, Array<string> | null>
  profile: Record<
    string,
    { name: string; pm: boolean; image: string; loading: boolean; is_verified: boolean; emoji: string }
  >
  lastFetch: Record<string, Date>
  theme: Record<string, ThemeData | undefined>
  cursors: Record<string, { nextCursor: string; prevCursor: string }>
}

export const useChatStore = defineStore('chat', () => {
  const store = reactive<Storage>({
    isPM: {},
    messages: {},
    roles: {},
    profile: {},
    lastFetch: {},
    theme: {},
    cursors: {},
  })

  function push(
    chat: string,
    msg: Messages,
    hookID: string | null = null,
    reverse: boolean = false
  ) {
    if (!Object.keys(store.messages).includes(chat)) {
      store.messages[chat] = []
    }

    const sorted = [] as Messages

    for (let i = 0; i < msg.length; i++) {
      const m = msg[i]
      const existingIndex = store.messages[chat].findIndex(
        (k) => k.id === m.id || (hookID != null && k.hookId === hookID)
      )
      if (existingIndex !== -1) {
        const existingMessage = store.messages[chat][existingIndex]
        if (existingMessage.underSending) {
          store.messages[chat][existingIndex] = m
        } else {
          store.messages[chat][existingIndex] = { ...existingMessage, ...m }
        }
      } else {
        sorted.push(m)
      }
    }

    if (reverse) store.messages[chat] = [...sorted, ...store.messages[chat]]
    else store.messages[chat] = [...store.messages[chat], ...sorted]
  }

  function setRoles(chat: string, roleList: Array<string>) {
    if (!Object.keys(store.roles).includes(chat)) {
      store.roles[chat] = []
    }
    store.roles[chat] = roleList
  }

  function pushLike(chat: string, mId: number, l: Like) {
    if (!Object.keys(store.messages).includes(chat)) return
    store.messages[chat].forEach((m) => {
      if (m.id != mId) return
      if (!m.likes) m.likes = []
      if (!m.likes.includes(l)) m.likes.push(l)
    })
  }

  function removeLike(chat: string, mId: number, l: Like) {
    if (!Object.keys(store.messages).includes(chat)) return
    store.messages[chat].forEach((m) => {
      if (m.id != mId) return
      if (!m.likes) return
      let inx = -1
      m.likes.forEach((like, i) => {
        if (like.id == l.id) {
          inx = i
        }
      })
      if (inx > -1) m.likes.splice(inx, 1)
    })
  }

  function shouldFetch(chatID: string): boolean {
    if (!(chatID in store.messages)) return true
    if (!(chatID in store.lastFetch)) return true
    if (store.lastFetch[chatID].getTime() > new Date().getTime() - 5 * 60 * 1000) {
      return !!store.isPM?.[chatID]
    }
    return Object.keys(store.roles).includes(chatID) && (store.roles[chatID] || []).length > 0
  }

  function rmMessageID(chatID: string, msgID: number) {
    if (!Object.keys(store.messages).includes(chatID)) return
    for (let i = 0; i < store.messages[chatID].length; i++) {
      const m = store.messages[chatID][i]
      if (m.id == msgID) {
        store.messages[chatID][i] = {
          content: '',
          created_at: m.created_at,
          data_json: '{}',
          hookId: '',
          id: m.id,
          likes: m.likes,
          reply: m.reply,
          sender: m.sender,
          type: 'deleted',
          underSending: false,
          updated_at: m.updated_at
        }
        break
      }
    }
  }

  return {
    push,
    pushLike,
    removeLike,
    setRoles,
    shouldFetch,
    rmMessageID,
    roles: store.roles,
    messages: store.messages,
    profile: store.profile,
    isPM: store.isPM,
    lastFetch: store.lastFetch,
    theme: store.theme,
    cursors: store.cursors,
  }
})
