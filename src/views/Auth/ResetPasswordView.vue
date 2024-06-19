<template>
  <GuestLayout>
    <h1 class="text-2xl fontTheme">{{ $t('Reset password') }}</h1>
    <hr class="bg-tertiary w-full border-none h-1 rounded-full my-3" />
    <AutoForm
      :resource="`/set-new-password/${route.params.token}`"
      :fields="[
        {
          icon: Lock,
          name: 'password',
          type: 'password',
          label: 'Password',
          placeholder: 'Password'
        }
      ]"
      :password-check="true"
      @success="handle"
    />
    <div>
      <p class="mt-2 text-gray-400 text-sm">
        {{ $t("Do you remember?") }}
        <router-link :to="{ name: 'auth.login' }">{{ $t('Login') }}</router-link>
      </p>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import AutoForm from '@/components/Auth/AutoForm.vue'
import { useRoute, useRouter } from 'vue-router'
import Lock from '@/components/Icons/Lock.vue'
import { useToast } from 'vue-toastification'
import { onMounted } from 'vue'
import request from '@/scripts/request/request'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const i18n = useI18n()

const handle = () => router.push({ name: 'auth.login' })

onMounted(async () => {
  const res = await request.get('/set-new-password/' + (route.params.token as string))
  if(res.status == 200) return
  toast.warning(i18n.t('Reset password expired'))
})
</script>
