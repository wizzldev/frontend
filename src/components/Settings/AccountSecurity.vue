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

    <PushButton
      class="transition-colors w-full py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
      :class="{ 'bg-secondary-all': !ipCheckEnabled, 'bg-red-all': ipCheckEnabled }"
      :loading="changingIPCheck"
      @click="switchIPCheck"
    >
      {{ $t(`${ipCheckEnabled ? 'Disable' : 'Enable'} IP Check`) }}
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
const changingIPCheck = ref(false)
const ipCheckEnabled = ref(auth.user?.enable_ip_check || false)

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

const switchIPCheck = async () => {
  const res = await request.get('/me/ip-check')
  const data = res.data as { enabled: boolean }
  if (res.data.$error) {
    toast.error(i18n.t('An unknown error occurred'))
    return
  }
  ipCheckEnabled.value = data.enabled
}
</script>
