import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { Contact, Contacts } from '@/types/contact'
import type { Message } from '@/types/message'
import request from '@/scripts/request/request'

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref([]) as Ref<Contacts>
  const page = ref(1)

  function push(c: Contacts) {
    for(let i = 0; i < c.length; i++) {
      if(contacts.value.filter(con => con.id == c[i].id).length > 0) continue
      contacts.value.push(c[i])
    }
    sort()
  }

  function update(cID: number, message: Message) {
    for (let i = 0; i < contacts.value.length; i++) {
      if (contacts.value[i].id === cID) {
        contacts.value[i].last_message = {
          sender_id: message.sender.id,
          sender_name: message.sender.first_name,
          content: message.content,
          type: message.type,
          date: message.created_at,
          nick_name: message.sender?.nick_name || '',
        }
        break
      }
    }
    sort()
  }

  function sort() {
    contacts.value = contacts.value.sort((a, b) =>
      new Date(a.last_message.date).getTime() > new Date(b.last_message.date).getTime() ? -1 : 1
    )
  }

  function findByID(id: number): Contact | null {
    for(let i = 0; i < contacts.value.length; i++) {
      if(contacts.value[i].id == id) {
        return contacts.value[i]
      }
    }
    return null
  }

  function removeByID(id: number) {
    for(let i = 0; i < contacts.value.length; i++) {
      if(contacts.value[i].id == id) {
        contacts.value.splice(i, 1)
        break
      }
    }
  }

  async function fetch(): Promise<boolean> {
    const res = await request.get('/chat/contacts' + (page.value ? `?page=${page.value}` : ''))
    page.value++
    if (!res.data.$error && !res.data?.nullValue && res.data.length > 0) {
      push(res.data)
      return true
    }
    return false
  }

  function reload() {
    contacts.value = []
    page.value = 1
  }

  return { contacts, fetch, push, update, findByID, removeByID, reload }
})
