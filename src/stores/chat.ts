import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { Like, Messages } from '@/types/message'

export const useChatStore = defineStore('chat', () => {
  const isPM = ref({}) as Ref<Record<string, boolean>>
  const messages = ref({}) as Ref<Record<string, Messages>>
  const roles = ref({}) as Ref<Record<string, Array<string> | null>>
  const profile = ref({}) as Ref<Record<string, { name: string; image: string; loading: boolean }>>

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
    console.log('reverse', reverse)
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
    if (isPM.value?.[chatID]) return false
    return Object.keys(roles.value).includes(chatID) && (roles.value[chatID] || []).length > 0
  }

  return { push, pushLike, removeLike, setRoles, shouldFetch, roles, messages, profile, isPM }
})
