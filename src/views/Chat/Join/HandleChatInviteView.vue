<template>
  <AppLayout>
    <MyProfile :backButton="undefined" />
    <ChatNav class="!py-0" />
    <main class="h-full flex flex-col space-y-3">
      <div class="my-auto text-center mx-5" v-if="!info && !err">
          <h1 class="text-xl fontTheme">Processing invite code <Spinner /></h1>
          <div class="bg-secondary w-min px-5 py-1 rounded-lg mx-auto mt-3">
            <p class="text-center text-gray-400">{{ route.params.code as string }}</p>
          </div>
      </div>
      <div class="my-auto text-center mx-5" v-if="err">
        <h1 class="text-xl fontTheme">{{ $t('Invalid invite code') }}</h1>
        <PushButtonSecondary :is-link="true" to-name="chat.new" class="w-1/2 mx-auto !p-1">
          {{ $t('Back') }}
        </PushButtonSecondary>
      </div>
      <div class="my-auto text-center mx-5" v-if="info != undefined && !err">
        <LazyImage alt="Group image" :src="cdnImage(info?.image_url, 64)" class="w-10 h-10 rounded-lg mx-auto" />
        <h1 class="text-xl fontTheme mt-1" v-emoji>
          {{ info.name }} <VerifiedBadge v-if="info.is_verified" class="text-yellow-400" />
        </h1>
        <p class="mt-2 text-gray-400">
          {{ $t('Fast reaction emoji') }}:
          <span v-emoji>{{ info.emoji }}</span>
        </p>
        <PushButtonSecondary :loading="joining" @click="useCoupon" class="w-1/2 mx-auto !p-1">
          {{ $t('Join') }}
        </PushButtonSecondary>
        <PushButtonSecondary @click="rolesModal = true" class="w-1/2 mx-auto !p-1">
          {{ $t('View roles') }}
        </PushButtonSecondary>
        <PushButtonSecondary :is-link="true" to-name="chat.new" class="w-1/2 mx-auto !p-1">
          {{ $t('Back') }}
        </PushButtonSecondary>
      </div>
    </main>
  </AppLayout>

  <Modal :show="true" v-if="rolesModal" @close="rolesModal = false">
    <h2 class="text-2xl fontTheme">{{ $t('Group roles') }}</h2>
    <p class="mt-2 text-center text-gray-400 text-sm">
      {{ $t('These roles will apply to you') }}
    </p>
    <ul class="mt-2 max-h-52 overflow-y-scroll py-2">
      <li class="bg-violet-500 w-full px-2 py-1 rounded-lg my-2" v-for="role in info?.roles" :key="role">
        {{ role }}
      </li>
    </ul>
  </Modal>
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
import { onMounted, ref } from 'vue'
import type { Group } from '@/types/contact'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import { cdnImage } from '@/scripts/image'
import PushButtonSecondary from '@/components/Elements/PushButtonSecondary.vue'
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import { useContactsStore } from '@/stores/contacts'
import Modal from '@/components/Modals/Modal.vue'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const toast = useToast()
const err = ref(false)
const info = ref<Group|undefined>(undefined)
const joining = ref(false)
const contacts = useContactsStore()
const rolesModal = ref(false)

const fetchInfo = async () => {
  const code = route.params.code as string
  const res = await request.get(`/invite/${code}`)
  const data = res.data
  if(!res.data.$error && data && !data.nullValue) info.value = data
  else err.value = true
}

const useCoupon = async () => {
  joining.value = true
  const code = route.params.code as string
  const res = await request.get(`/invite/${code}/use`)
  const data = res.data as { group_id?: number | undefined }
  if (res.data.$error || !data.group_id) {
    toast.error(i18n.t('Invalid invite code'))
    await router.push({name: 'chat.new'})
    return
  }
  contacts.reload()
  joining.value = false
  await router.push({ name: 'chat.message', params: { id: data.group_id } })
}

onMounted(fetchInfo)
</script>
