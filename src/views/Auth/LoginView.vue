<template>
  <GuestLayout>
    <h1 class="text-2xl">Login</h1>
    <AutoForm
      resource="/login"
      :fields="[
        {
          name: 'email',
          type: 'email',
          label: 'Enter your email address',
          placeholder: 'email@wizzl.co'
        },
        {
          name: 'password',
          type: 'password',
          label: 'Enter your password',
          placeholder: 'Password'
        }
      ]"
      @success="handleLogin"
    />
  </GuestLayout>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import AutoForm from '@/components/Auth/AutoForm.vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/user'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = (data: object) => {
  if ('session' in data && 'user' in data) {
    authStore.login(data.user as User, data.session as string)
  }
  router.push({ name: 'chat.contacts' })
}
</script>
