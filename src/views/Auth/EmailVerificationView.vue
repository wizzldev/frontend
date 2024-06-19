<template>
  <GuestLayout>
    <h1 class="text-2xl fontTheme">{{ $t('Email verification') }}</h1>
    <hr class="bg-tertiary w-full border-none h-1 rounded-full my-3" />
    <AutoForm
      resource="/request-new-email-verification"
      :fields="[
        {
          icon: EmailAt,
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Email'
        }
      ]"
      :password-check="true"
      @success="handle"
    />
    <div>
      <p class="mt-2 text-gray-400 text-sm">
        <router-link :to="{ name: 'auth.login' }">{{ $t('Login') }}</router-link>
      </p>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import AutoForm from '@/components/Auth/AutoForm.vue'
import { useRouter } from 'vue-router'
import EmailAt from '@/components/Icons/EmailAt.vue'

const router = useRouter()
const handle = () => router.push({ name: 'auth.login' })
</script>
