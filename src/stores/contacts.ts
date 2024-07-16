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
    for(let i = 0; i < contacts.value.length; i++) {
      if(contacts.value[i].id === cID) {
        contacts.value[i].last_message = {
          sender_id: message.sender.id,
          sender_name: message.sender.first_name,
          content: message.content,
          type: message.type,
          date: message.created_at
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

  return { contacts, push, update }
})
