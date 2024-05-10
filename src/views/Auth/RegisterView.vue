<template>
  <GuestLayout>
    <h1 class="text-2xl fontTheme">{{ $t('Register') }}</h1>
    <hr class="bg-tertiary w-full border-none h-1 rounded-full my-3" />
    <AutoForm
      resource="/register"
      :fields="[
        {
          icon: Person,
          name: 'first_name',
          type: 'string',
          label: 'First name',
          placeholder: 'John',
        },
        {
          icon: Person,
          name: 'last_name',
          type: 'string',
          label: 'Last name',
          placeholder: 'Doe',
        },
        {
          icon: EmailAt,
          name: 'email',
          type: 'email',
          label: 'Email address',
          placeholder: 'email@wizzl.co'
        },
        {
          icon: Lock,
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Password'
        }
      ]"
      :password-check="true"
      @success="handleLogin"
    />
    <div>
      <p>
        {{ $t('Already have an account?') }} <router-link :to="{name: 'auth.login'}">{{ $t('Login') }}</router-link>
      </p>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import AutoForm from '@/components/Auth/AutoForm.vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/user'
import { useRoute, useRouter } from 'vue-router'
import EmailAt from '@/components/Icons/EmailAt.vue'
import Lock from '@/components/Icons/Lock.vue'
import Person from '@/components/Icons/Person.vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const handleLogin = (data: object) => {
  if ('session' in data && 'user' in data) {
    authStore.login(data.user as User, data.session as string)
  }
  if('to' in route.query) router.push(route.query.to as string)
  else router.push({ name: 'chat.contacts' })
}
</script>
