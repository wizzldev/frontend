import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { Contacts } from '@/types/contact'
import type { Message } from '@/types/message'

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref([]) as Ref<Contacts>

  function push(c: Contacts) {
    contacts.value.push(...c)
    sort()
  }

  function update(cID: number, message: Message) {
    contacts.value.forEach(c => {
      if(c.id == cID) c.last_message = {
        content: message.content,
        date: message.created_at,
        sender_name: message.sender.first_name,
        type: message.type,
        sender_id: message.sender.id
      }
    })
    sort()
  }

  function sort() {
    contacts.value = contacts.value.sort((a, b) => (new Date(a.last_message.date)).getTime() > (new Date(b.last_message.date)).getTime() ? -1 : 1)
    console.log("sorted", contacts.value)
  }

  return { contacts, push, update }
})