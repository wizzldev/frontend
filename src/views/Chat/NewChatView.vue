<template>
  <ContactsLayout>
    <form v-on:submit.prevent="add" class="px-5">
      <IconInput :disabled="loading" :value="input" v-model.lazy="input" placeholder="Enter email" :icon="EmailAt" />
    </form>
    <ChatNav />
    <div class="px-2 mt-3">
      <ul>
        <li
          class="my-2 bg-secondary px-4 py-2 w-full flex items-center justify-between rounded-xl"
          v-for="user in users"
          :key="user.id"
        >
          <img class="w-8 h-8 rounded-full" :src="user.image_url" alt="User image" />
          <p>{{ user.first_name }} {{ user.last_name }}</p>
          <button @click="rm(user)">
            &times;
          </button>
        </li>
        <li v-if="users.length >= 1">
          <button @click="submit" class="my-2 bg-secondary px-4 py-2 w-full rounded-full text-center">
            {{ $t('Start chatting') }}
          </button>
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
import type { User } from '@/types/user'
import request from '@/scripts/request/request'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const i18n = useI18n()
const toast = useToast()
const users = ref([]) as Ref<Array<User>>
const input = ref('')
const loading = ref(false)

const add = async () => {
  loading.value = true

  const res = await request.post('/users/findByEmail', {email: input.value})
  if(!res.data.$error) {
    if(users.value.indexOf(res.data) == -1) users.value.push(res.data as User)
  } else {
    toast.error(i18n.t('User could not be found'))
  }

  loading.value = false
  input.value = ''
}

const rm = (e: User) => {
  const inx = users.value.indexOf(e)
  users.value.splice(inx, 1)
}

const submit = async () => {
  if(users.value.length == 1) await addPM()
}

const addPM = async () => {
  if(users.value.length < 1) return
  const res = await request.get(`/chat/private/${users.value[0].id}`)
  if(!res.data?.$error) {
    return router.push({ name: 'chat.message', params: { id: res.data?.pm_id } })
  }
}
</script>
