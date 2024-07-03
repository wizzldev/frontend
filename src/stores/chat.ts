import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { Like, Messages } from '@/types/message'
import type { ThemeData } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  const isPM = ref({}) as Ref<Record<string, boolean>>
  const messages = ref({}) as Ref<Record<string, Messages>>
  const roles = ref({}) as Ref<Record<string, Array<string> | null>>
  const profile = ref({}) as Ref<Record<string, { name: string; image: string; loading: boolean }>>
  const lastFetch = ref<Record<string, Date>>({})
  const theme = ref<Record<string, ThemeData | undefined>>({})

  function push(
    chat: string,
    msg: Messages,
    hookID: string | null = null,
    reverse: boolean = false
  ) {
    if (!Object.keys(messages.value).includes(chat)) {
      messages.value[chat] = []
    }

    const sorted = [] as Messages

    for (let i = 0; i < msg.length; i++) {
      const m = msg[i]
      const j = messages.value[chat].find(
        (k) => k.id == m.id || (hookID != null && k.hookId == hookID)
      )
      if (j && j.underSending && j.hookId == hookID) {
        const rmInx = messages.value[chat].indexOf(j)
        if (rmInx !== -1) messages.value[chat].splice(rmInx, 1)
      }

      if (!j) sorted.push(m)
      else break
    }
    if (reverse) messages.value[chat] = [...sorted, ...messages.value[chat]]
    else messages.value[chat] = [...messages.value[chat], ...sorted]
  }

  function setRoles(chat: string, roleList: Array<string>) {
    if (!Object.keys(roles.value).includes(chat)) {
      roles.value[chat] = []
    }
    roles.value[chat] = roleList
  }

  function pushLike(chat: string, mId: number, l: Like) {
    if (!Object.keys(messages.value).includes(chat)) return
    messages.value[chat].forEach((m) => {
      if (m.id != mId) return
      if (!m.likes) m.likes = []
      if (!m.likes.includes(l)) m.likes.push(l)
    })
  }

  function removeLike(chat: string, mId: number, l: Like) {
    if (!Object.keys(messages.value).includes(chat)) return
    messages.value[chat].forEach((m) => {
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
    if (!(chatID in messages.value)) return true
    if (!(chatID in lastFetch.value)) return true
    if (lastFetch.value[chatID].getTime() > new Date().getTime() - 2 * 60 * 1000)
      if (isPM.value?.[chatID]) return false
    return Object.keys(roles.value).includes(chatID) && (roles.value[chatID] || []).length > 0
  }

  function rmMessageID(chatID: string, msgID: number) {
    if (!Object.keys(messages.value).includes(chatID)) return
    for (let i = 0; i < messages.value[chatID].length; i++) {
      const m = messages.value[chatID][i]
      if (m.id == msgID) {
        messages.value[chatID][i] = {
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
    roles,
    messages,
    profile,
    isPM,
    lastFetch,
    theme
  }
})
