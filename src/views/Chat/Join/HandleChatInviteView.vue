<template>
  <AppLayout>
    <MyProfile :backButton="undefined" />
    <ChatNav class="!py-0" />
    <main class="h-full flex flex-col space-y-3">
      <div class="my-auto text-center mx-5">
        <h1 class="text-xl fontTheme">Processing invite code <Spinner /></h1>
        <div class="bg-secondary w-min px-5 py-1 rounded-lg mx-auto mt-3">
          <p class="text-center text-gray-400">{{ route.params.code as string }}</p>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import ChatNav from '@/components/ChatV1/ChatNav.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import MyProfile from '@/components/Navigation/MyProfile.vue'
import Spinner from '@/components/Icons/Spinner.vue'
import request from '@/scripts/request/request'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const toast = useToast()

const useCoupon = async () => {
  const code = route.params.code as string
  const res = await request.get(`/invite/${code}`)
  const data = res.data as { group_id?: number | undefined }
  if (res.data.$error || !data.group_id) {
    toast.error(i18n.t('Invalid invite code'))
    await router.push('/contacts')
    return
  }
  await router.push({ name: 'chat.message', params: { id: data.group_id } })
}

onMounted(useCoupon)
</script>
