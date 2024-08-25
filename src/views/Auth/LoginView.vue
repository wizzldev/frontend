<template>
  <GuestLayout>
    <h1 class="text-2xl fontTheme">{{ $t('Login') }}</h1>
    <hr class="bg-tertiary w-full border-none h-1 rounded-full my-3" />
    <AutoForm
      resource="/login"
      :fields="[
        {
          icon: EmailAt,
          name: 'email',
          type: 'email',
          label: 'Email address',
          placeholder: 'email@wizzl.app'
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
      <p class="mt-2 text-gray-400 text-sm">
        {{ $t("Don't have an account?") }}
        <router-link :to="{ name: 'auth.register' }">{{ $t('Register') }}</router-link>
      </p>
      <p class="mt-1 text-gray-400 text-sm">
        <router-link :to="{ name: 'auth.reset-password' }">{{ $t('Reset password') }}</router-link>
        |
        <router-link :to="{ name: 'auth.email-verification' }">{{
          $t('Email verification')
        }}</router-link>
      </p>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import AutoForm from '@/components/Auth/AutoForm.vue'
import { useAuth2Store } from '@/stores/auth2'
import type { User } from '@/types/user'
import { useRoute, useRouter } from 'vue-router'
import EmailAt from '@/components/Icons/EmailAt.vue'
import Lock from '@/components/Icons/Lock.vue'
import { addListeners } from '@/scripts/mobile/notification'
import request from '@/scripts/request/request'

const auth = useAuth2Store()
const route = useRoute()
const router = useRouter()

const handleLogin = async (data: object) => {
  if ('session' in data && 'user' in data) {
    await auth.login(data.user as User, data.session as string)
    await addListeners(request, router)
  }
  if ('to' in route.query) await router.push(route.query.to as string)
  else await router.push({ name: 'chat.contacts' })
}
</script>
