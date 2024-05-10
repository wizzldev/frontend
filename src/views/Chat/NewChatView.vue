<template>
  <ContactsLayout>
    <form v-on:submit.prevent="add" class="px-5">
      <IconInput v-model.lazy="input" placeholder="Enter email" :icon="EmailAt" />
    </form>
    <ChatNav />
    <div class="px-2 mt-3">
      <ul>
        <li
          class="my-2 bg-secondary px-4 py-2 w-full flex items-center justify-between rounded-xl"
          v-for="email in emails"
          :key="email"
        >
          <p>{{ email }}</p>
          <button @click="rm(email)">x</button>
        </li>
      </ul>
    </div>
  </ContactsLayout>
</template>

<script setup lang="ts">
import ContactsLayout from '@/layouts/ContactsLayout.vue'
import ChatNav from '@/components/Chat/ChatNav.vue'
import IconInput from '@/components/Elements/IconInput.vue'
import EmailAt from '@/components/Icons/EmailAt.vue'
import { type Ref, ref } from 'vue'

const emails = ref([]) as Ref<Array<string>>
const input = ref('')

const add = () => {
  emails.value.push(input.value)
  input.value = ''
}

const rm = (e: string) => {
  const inx = emails.value.indexOf(e)
  emails.value.splice(inx, 1)
}
</script>
