<template>
  <section class="mx-4 my-4">
    <h2 class="text-lg font-bold">{{ $t('Password & Security') }}</h2>
    <FormButtonSecondary
      @submit="requestNewPassword"
      class="!py-2"
      title="Reset password"
      :processing="false"
    />

    <PushButton
      :is-link="true"
      to-name="settings.sessions"
      class="transition-colors w-full bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
    >
      {{ $t('Sessions') }}
    </PushButton>

    <PushButton
      :is-link="true"
      to-name="settings.ips"
      class="transition-colors w-full bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
    >
      {{ $t('IP addresses') }}
    </PushButton>
  </section>
</template>

<script setup lang="ts">
import FormButtonSecondary from '@/components/Auth/FormButtonSecondary.vue'
import { useAuthStore } from '@/stores/auth'
import request from '@/scripts/request/request'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import PushButton from '@/components/Elements/PushButton.vue'

const auth = useAuthStore()
const i18n = useI18n()
const toast = useToast()
const newPassProcessing = ref(false)

const requestNewPassword = async () => {
  newPassProcessing.value = true
  const res = await request.post('/request-new-password', {
    email: auth.user?.email
  })
  newPassProcessing.value = false
  if (res.data?.error || res.status != 200) {
    toast.error(i18n.t(res.data?.error || 'error.unknown'))
    return
  }
  toast.success(i18n.t('Reset password email sent'))
}
</script>
