<template>
  <ContactsLayout>
    <section class="px-5">
      <IconInput v-model="searchInput" :value="searchInput" :icon="Magnifier as Component" placeholder="Search" />
    </section>
    <ChatNav />
    <div class="mx-5 pb-2 hidden">
      <PremiumAd />
    </div>
    <section class="h-full w-full max-w-full overflow-y-scroll pt-1">
      <div v-if="!hasContact" class="w-full my-auto text-center">
        <h2 class="text-gray-600 fontTheme px-2">
          {{ $t('You currently have no active conversation') }}
        </h2>
        <PushButton
          :is-link="true"
          to-name="chat.new"
          class="w-1/3 m-auto p-1 bg-secondary-all rounded-full text-xs mt-2 text-center"
        >
          {{ $t('New chat') }}
        </PushButton>
      </div>

      <div class="w-full">
        <template v-for="(con, i) in contacts.contacts" :key="i">
          <PushButton
            class="w-full"
            v-if="searchInput == '' || con.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1"
            :is-link="true"
            to-name="chat.message"
            :to-params="{ id: con?.id }"
          >
            <Contact
              :title="con.name"
              :image="cdnImage(con.image, 256)"
              :id="con.id"
              :message="con.last_message"
              :verified="con.is_verified"
            />
          </PushButton>
        </template>

        <div class="text-center px-2 mt-3 mb-2" v-if="hasContact && noMoreContact">
          <p class="text-sm text-gray-600 fontTheme">
            {{ $t('No more active conversations') }}
          </p>
          <PushButton
            :is-link="true"
            to-name="chat.new"
            class="w-1/3 m-auto p-1 bg-secondary-all rounded-full text-xs mt-2"
          >
            {{ $t('New chat') }}
          </PushButton>
        </div>

        <div class="text-center px-2 mt-3 mb-2" v-else-if="!noMoreContact">
          <PushButton
            @click="fetchContacts(true)"
            class="w-1/3 m-auto p-1 bg-secondary-all rounded-full text-xs mt-2"
          >
            <span v-if="!loading">{{ $t('Load more') }}</span>
            <Spinner class="!w-2.5 !h-2.5" v-else />
          </PushButton>
        </div>
      </div>
    </section>
  </ContactsLayout>
</template>

<script setup lang="ts">
import ContactsLayout from '@/layouts/ContactsLayout.vue'
import IconInput from '@/components/Elements/IconInput.vue'
import Contact from '@/components/Contact.vue'
import PushButton from '@/components/Elements/PushButton.vue'
import { type Component, computed, onMounted, ref, watch } from 'vue'
import request from '@/scripts/request/request'
import ChatNav from '@/components/ChatV1/ChatNav.vue'
import Magnifier from '@/components/Icons/Magnifier.vue'
import { useContactsStore } from '@/stores/contacts'
import { cdnImage } from '@/scripts/image'
import PremiumAd from '@/components/PremiumAd.vue'
import Spinner from '@/components/Icons/Spinner.vue'

const loading = ref(false)
const contacts = useContactsStore()
const noMoreContact = ref(false)
const hasContact = computed(() => contacts.contacts.length)

const fetchContacts = async (hard: boolean = false) => {
  noMoreContact.value = false
  if(hasContact.value && !hard) return
  loading.value = true
  noMoreContact.value = !await contacts.fetch()
  loading.value = false
}

const searchInput = ref('')

onMounted(fetchContacts)

watch(contacts, (c) => {
  if(c.contacts.length == 0) fetchContacts()
})
</script>
