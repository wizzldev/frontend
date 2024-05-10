<template>
  <ContactsLayout>
    <section class="px-5">
      <IconInput v-model="searchInput" :icon="Magnifier" placeholder="Search" />
    </section>
    <ChatNav />
    <section class="mt-3 h-full" :class="{ 'flex items-center justify-center': !hasContact }">
      <h2 v-if="!hasContact" class="text-gray-600 fontTheme px-2">
        {{ $t('You currently have no active conversation') }}
      </h2>

      <template v-for="(con, i) in contacts.contacts" :key="i">
        <PushButton
          v-if="showSearch(con)"
          :is-link="true"
          to-name="chat.message"
          :to-params="{ id: con.id }"
        >
          <Contact :title="con.name" :image="con.image" :message="con.last_message" />
        </PushButton>
      </template>

      <div class="text-center px-2 mt-3 mb-2">
        <p v-if="hasContact" class="text-sm text-gray-600 fontTheme">
          {{ $t('No more active conversations') }}
        </p>
        <PushButton
          :is-link="true"
          to-name="chat.new"
          class="w-1/3 m-auto p-1 bg-secondary rounded-full text-xs mt-2"
        >
          {{ $t('New chat') }}
        </PushButton>
      </div>
    </section>
  </ContactsLayout>
</template>

<script setup lang="ts">
import ContactsLayout from '@/layouts/ContactsLayout.vue'
import IconInput from '@/components/Elements/IconInput.vue'
import Contact from '@/components/Contact.vue'
import PushButton from '@/components/Elements/PushButton.vue'
import { computed, onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import ChatNav from '@/components/Chat/ChatNav.vue'
import Magnifier from '@/components/Icons/Magnifier.vue'
import { useChatStore } from '@/stores/chat'
import type { Messages } from '@/types/message'
import type { Contact as TContact } from '@/types/contact'
import { useContactsStore } from '@/stores/contacts'

const contacts = useContactsStore()
const chat = useChatStore()
const hasContact = computed(() => contacts.contacts.length)

const fetchContacts = async () => {
  if(contacts.contacts.length > 0) {
    return
  }

  const res = await request.get('/chat/contacts')
  if (!res.data.$error) {
    contacts.push(res.data)
  }

  window.WS.channel().on<{ resource: string; group_id: number }>('should_fetch', async (r) => {
    const res = await request.get(`/${r.resource.replace('.', '/')}`)
    if (!res.data.$error) {
      chat.push(r.resource, res.data.messages as Messages)
      contacts.update(r.group_id, res.data.messages[0])
    }
  })
}

const searchInput = ref('')
const showSearch = (con: TContact): boolean => {
  const s = con.name.toLowerCase()
  return s.indexOf(searchInput.value) > -1
}

onMounted(fetchContacts)
</script>
