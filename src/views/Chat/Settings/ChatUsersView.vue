<template>
  <ChatSettingsLayout
    :chat-profile="chatProfile"
    :is-you="false"
    :theme="undefined"
    to-name="chat.settings"
    :to-params="{ id: route.params.id }"
  >
    <main class="px-4 my-2" v-if="loaded">
      <h1 class="text-xl fontTheme text-center">{{ $t('Members') }}</h1>
      <p class="text-center text-gray-400 flex items-center justify-center space-x-1">
        <Spinner v-if="userCount < 1" />
        <span v-else>{{ userCount }}</span>
        <b>/</b>
        <span v-if="chatProfile.isPrivateMessage">2</span>
        <span v-else>10 000</span>
      </p>
      <ul class="mt-5">
        <li
          v-for="user in users"
          :key="user.id"
          class="my-2 bg-secondary px-4 py-2 w-full flex items-center justify-between rounded-xl"
        >
          <div class="flex items-center space-x-2 justify-start">
            <div class="relative">
              <LazyImage
                class="w-8 h-8 min-w-8 min-h-8 rounded-xl"
                :src="cdnImage(user.image_url)"
                alt="User image"
              />
              <span
                v-if="user.is_online"
                v-tippy="{ content: $t('Active') }"
                class="w-3 h-3 right-0 -mt-2 -mr-0.5 bg-green-400 rounded-full absolute"
              ></span>
            </div>
            <div>
              <p>{{ user.first_name }} {{ user.last_name }}</p>
              <p v-if="user.email" class="text-xs text-gray-400">{{ user.email }}</p>
              <p
                v-tippy="{ content: $t('This user is managed by a program.') }"
                v-else
                class="cursor-pointer text-xs text-gray-400"
              >
                BOT
              </p>
            </div>
          </div>
          <button
            @click="userSheet = user"
            class="flex items-center justify-center transition-colors text-gray-300 hover:text-gray-400 focus:text-purple-400"
          >
            <SettingBars />
          </button>
        </li>
        <li v-if="nextCursor">
          <button
            @click="fetchUsers"
            class="text-center text-lg fontTheme my-2 bg-secondary px-4 py-2 w-full flex items-center space-x-2 rounded-xl"
          >
            <span>Load more</span>
            <Spinner v-if="userLoading" />
          </button>
        </li>
      </ul>
    </main>
  </ChatSettingsLayout>
  <ChatUserSheet
    :user="userSheet as User"
    :show="userSheet != null"
    @close="userSheet = null"
    :isPM="chatProfile.isPrivateMessage"
    :roles="yourRoles"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { fetchInfo, getChatProfileRef } from '@/views/Chat/Settings/fetchInfo'
import ChatSettingsLayout from '@/layouts/ChatSettingsLayout.vue'
import type { User } from '@/types/user'
import request from '@/scripts/request/request'
import { error } from '@/scripts/translateToast'
import { cdnImage } from '@/scripts/image'
import Spinner from '@/components/Icons/Spinner.vue'
import SettingBars from '@/components/Icons/SettingBars.vue'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import ChatUserSheet from '@/views/Chat/Settings/ChatUserSheet.vue'

const route = useRoute()
const chatProfile = getChatProfileRef()
const yourRoles = ref<Array<string>>([])
const loaded = ref(false)
const userLoading = ref(false)
const users = ref<Array<User>>([])
const userSheet = ref<User | null>(null)

const fetchProfile = async () => {
  const { user, your_roles } = await fetchInfo(route.params.id as string)
  if (!user) return
  chatProfile.value = user
  loaded.value = true
  if (!your_roles) return
  yourRoles.value = your_roles
}

const nextCursor = ref('')
const userCount = ref(0)

const fetchUsers = async () => {
  userLoading.value = true
  const res = await request.get(`/chat/${route.params.id}/users?cursor=${nextCursor.value}`)
  userLoading.value = false
  if (res.data.$error) return error('Failed to load members')
  const data = res.data as { data: Array<User>; next_cursor: string }
  nextCursor.value = data.next_cursor
  users.value.push(...data.data)
}

const fetchUserCount = async () => {
  const res = await request.get(`/chat/${route.params.id}/user_count`)
  if (res.data.$error) return
  const data = res.data as { count: number }
  userCount.value = data.count
}

onMounted(async () => {
  await fetchProfile()
  await fetchUsers()
  await fetchUserCount()
})
</script>
