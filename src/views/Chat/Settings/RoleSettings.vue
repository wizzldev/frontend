<template>
  <ChatSettingsLayout
    :chat-profile="chatProfile"
    :connection="{ connected: true, error: false }"
    :theme="undefined"
    :isYou="false"
    to-name="chat.settings"
    :to-params="{ id: route.params.id }"
  >
    <main class="px-4 my-2 text-gray-500">
      <RolePicker :yourRoles="yourRoles" :roles="allRole" :active="usedRoles" @toggle="toggle" />
      <div class="mt-5">
        <button
          @click="save"
          :disabled="loading"
          class="text-white transition-colors my-2 w-full bg-purple-500 hover:bg-purple-400 focus:bg-purple-400 py-2 rounded-xl fontTheme flex items-center space-x-2 justify-center"
        >
          <span>{{ $t('Save') }}</span>
          <Spinner v-if="loading" />
        </button>
      </div>
    </main>
  </ChatSettingsLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchInfo } from '@/views/Chat/Settings/fetchInfo'
import RolePicker from '@/components/Group/RolePicker.vue'
import request from '@/scripts/request/request'
import Spinner from '@/components/Icons/Spinner.vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import ChatSettingsLayout from '@/layouts/ChatSettingsLayout.vue'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const toast = useToast()
const chatProfile = ref({
  id: 0,
  name: '',
  image: '',
  isPrivateMessage: false,
  loading: true,
  is_verified: false
})
const usedRoles = ref<Array<string>>([])
const allRole = ref<Array<string>>([])
const yourRoles = ref<Array<string>>([])
const loading = ref(false)

const fetchProfile = async () => {
  const { user, roles, your_roles } = await fetchInfo(route.params.id as string)
  if (!user) return
  chatProfile.value = user
  if (!your_roles || !your_roles.includes('ADMIN')) {
    await router.push({ name: 'chat.settings', params: { id: route.params.id } })
    return
  }
  yourRoles.value = your_roles
  if (!roles) return
  usedRoles.value = roles
}

const fetchRoles = async () => {
  const res = await request.get('/chat/roles')
  if (!res?.data?.$error) {
    const r = res.data as { roles: Array<string> }
    allRole.value = r.roles
  }
}

const toggle = (role: string) => {
  if (loading.value) return
  if (usedRoles.value.includes(role)) usedRoles.value.splice(usedRoles.value.indexOf(role), 1)
  else usedRoles.value.push(role)
}

const save = async () => {
  loading.value = true
  const res = await request.put(`/chat/${route.params.id as string}/roles`, {
    roles: usedRoles.value
  })
  loading.value = false

  if (!res.data.$error) toast.success(i18n.t('Successfully updated'))
  else toast.error(i18n.t('Something went wrong'))
}

onMounted(async () => {
  await fetchProfile()
  await fetchRoles()
})
</script>
