<template>
  <AppLayout>
    <MyProfile :class="{'border-b': groupSettings}" :backButton="groupSettings ? {route: 'chat.new'} : undefined" />
    <main v-if="!groupSettings" class="h-full flex flex-col space-y-3">
      <form v-on:submit.prevent="add" class="px-5">
        <IconInput :disabled="loading" :value="input" v-model.lazy="input" placeholder="Enter email" :icon="EmailAt" />
      </form>
      <ChatNav class="!py-0" />
      <div class="px-4 mt-3">
        <ul>
          <li
            class="my-2 bg-secondary px-4 py-2 w-full flex items-center justify-between rounded-xl"
            v-for="user in groupMake.users"
            :key="user.id"
          >
            <img class="w-8 h-8 rounded-full" :src="cdnImage(user.image_url)" alt="User image" />
            <p>{{ user.first_name }} {{ user.last_name }}</p>
            <button @click="rm(user)">
              &times;
            </button>
          </li>
          <li v-if="groupMake.users.length >= 1">
            <button @click="submit" class="my-2 bg-secondary px-4 py-2 w-full rounded-full text-center">
              {{ $t('Start chatting') }}
            </button>
          </li>
        </ul>
      </div>
    </main>
    <GroupCreateConfig v-else @create="addGroup" :loading="loading" />
  </AppLayout>
</template>

<script setup lang="ts">
import ChatNav from '@/components/ChatV1/ChatNav.vue'
import IconInput from '@/components/Elements/IconInput.vue'
import EmailAt from '@/components/Icons/EmailAt.vue'
import { onMounted, ref, watch } from 'vue'
import type { User } from '@/types/user'
import request from '@/scripts/request/request'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import GroupCreateConfig from '@/components/Group/GroupCreateConfig.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import MyProfile from '@/components/Navigation/MyProfile.vue'
import { useGroupMakeStore } from '@/stores/groupMake'
import { cdnImage } from '@/scripts/image'

const groupMake = useGroupMakeStore()
const router = useRouter()
const i18n = useI18n()
const toast = useToast()
const input = ref('')
const loading = ref(false)
const groupSettings = ref(false)
const route = useRoute()

const add = async () => {
  loading.value = true

  const res = await request.post('/users/findByEmail', {email: input.value})
  if(!res.data.$error) {
    if(groupMake.users.indexOf(res.data) == -1) groupMake.users.push(res.data as User)
  } else {
    toast.error(i18n.t('User could not be found'))
  }

  loading.value = false
  input.value = ''
  groupMake.save()
}

const rm = (e: User) => {
  const inx = groupMake.users.indexOf(e)
  groupMake.users.splice(inx, 1)
  groupMake.save()
}

const submit = async () => {
  if(groupMake.users.length == 1) await addPM()
  else {
    window.location.hash = "group"
    groupSettings.value = true
  }
}

const addPM = async () => {
  if(groupMake.users.length < 1) return
  const res = await request.get(`/chat/private/${groupMake.users[0].id}`)
  if(!res.data?.$error) {
    const pm = res.data as { pm_id: number }
    return router.push({ name: 'chat.message', params: { id: pm.pm_id } })
  }
}

const addGroup = async (name: string, roles: Array<string>) => {
  const user_ids = [] as Array<number>
  groupMake.users.forEach(u => user_ids.push(u.id))

  const res = await request.post('/chat/group', {
    name: name,
    user_ids,
    roles: roles,
  })

  if(!res.data?.$error) {
    const data = res.data as { group_id: number }
    await router.push({name: 'chat.message', params: {id: data.group_id}})
  }
}

onMounted(() => {
  groupMake.initialize()
  console.log(window.location.hash)
  groupSettings.value = window.location.hash == "#group"
})

watch(route, () => groupSettings.value = route.hash == "#group")
</script>
