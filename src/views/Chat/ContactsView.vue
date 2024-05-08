<template>
  <ContactsLayout>
    <section class="px-5">
      <IconInput/>
    </section>
    <section class="grid grid-cols-3 gap-2 mx-5 text-center">
      <PushButton :is-link="false" class="w-full px-2 py-1 bg-tertiary rounded-xl">
        {{ $t('Messages') }}
      </PushButton>
      <PushButton :is-link="false" class="w-full px-2 py-1 bg-secondary rounded-xl">
        {{ $t('Restricted') }}
      </PushButton>
      <PushButton :is-link="false" class="w-full px-2 py-1 bg-secondary rounded-xl">
        {{ $t('Blocked') }}
      </PushButton>
    </section>
    <section class="mt-3 h-full" :class="{'flex items-center justify-center': !hasContact}">
      <h2 v-if="!hasContact" class="text-gray-600 fontTheme">{{ $t('You currently have no active conversation') }}</h2>
      <PushButton v-for="(con, i) in contacts" :key="i" :is-link="true" to-name="chat.message" :to-params="{id: con.id}">
        <Contact
          :title="con.name"
          :image="con.image"
          :message="con.last_message"
        />
      </PushButton>
    </section>
  </ContactsLayout>
</template>

<script setup lang="ts">
import ContactsLayout from '@/layouts/ContactsLayout.vue'
import IconInput from '@/components/Elements/IconInput.vue'
import Contact from '@/components/Contact.vue'
import PushButton from '@/components/Elements/PushButton.vue'
import { computed, onMounted, type Ref, ref } from 'vue'
import type { Contacts } from '@/types/contact'
import request from '@/scripts/request/request'

const contacts = ref([]) as Ref<Contacts>
const hasContact = computed(() => contacts.value.length)

const fetchContacts = async () => {
  const res = await request.get('/chat/contacts')
  if(!res.data.$error) {
    contacts.value = res.data
  }
}

onMounted(fetchContacts)
</script>
