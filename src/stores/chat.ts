import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { Like, Messages } from '@/types/message'

export const useChatStore = defineStore('chat', () => {
  const messages = ref({}) as Ref<Record<string, Messages>>
  const profile = ref({}) as Ref<Record<string, { name: string; image: string; loading: boolean }>>

  function push(chat: string, msg: Messages) {
    if (!Object.keys(messages.value).includes(chat)) {
      messages.value[chat] = []
    }

    const sorted = [] as Messages
    for (let i = 0; i < msg.length; i++) {
      const m = msg[i]
      const j = messages.value[chat].find((k) => k.id == m.id)
      if (!j) sorted.push(m)
      else break
    }
    messages.value[chat] = [...sorted, ...messages.value[chat]]

    console.log(messages.value)
  }

  function pushLike(chat: string, mId: number, l: Like) {
    if (!Object.keys(messages.value).includes(chat)) return
    messages.value[chat].forEach(m => {
      if(m.id != mId) return
      if(!m.likes) m.likes = []
      m.likes.push(l)
    })
  }

  function removeLike(chat: string, mId: number, l: Like) {
    if (!Object.keys(messages.value).includes(chat)) return
    messages.value[chat].forEach(m => {
      if(m.id != mId) return
      if(!m.likes) return
      let inx = -1
      m.likes.forEach((like, i) => {
        if(like.id == l.id) {
          inx = i
        }
      })
      if(inx > -1) m.likes.splice(inx, 1)
    })
  }

  return { push, pushLike, removeLike, messages, profile }
})
