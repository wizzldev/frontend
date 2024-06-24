<template>
  <ChatLayout
    :chat-profile="chatProfile"
    :connection="{ connected: true, error: false }"
    :theme="undefined"
  >
    <header class="px-4 my-4 text-center">
      <LazyImage :alt="chatProfile.name" :src="cdnImage(chatProfile.image)" class="w-14 h-14 rounded-lg mx-auto" />
      <h2 class="text-center fontTheme">{{ chatProfile.name }}</h2>
      <SettingsButton v-if="!chatProfile.isPrivateMessage" class="text-sm" @click="editProfileImage = true">
        {{ $t('Edit profile image') }}
      </SettingsButton>
    </header>
    <main class="px-4 my-2 text-gray-500">
      <h4 class="text-sm font-bold">{{ $t('Customize') }}</h4>
      <div></div>
    </main>
  </ChatLayout>

  <Modal :show="editProfileImage" @close="editProfileImage = false">
    <ProfileImageCropper
      :image="chatProfile.image"
      :resource="`/chat/${route.params.id as string}/group-image`"
    />
  </Modal>
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute } from 'vue-router'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import SettingsButton from '@/components/Settings/SettingsButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import ProfileImageCropper from '@/components/Settings/ProfileImageCropper.vue'

const route = useRoute()
const chatProfile = ref({ name: '', image: '', isPrivateMessage: false, loading: true })
const editProfileImage = ref(false)

const fetchProfile = async () => {
  const res = await request.get(`/chat/user/${route.params.id as string}`)
  if (!res?.data?.$error) {
    const user = res.data as { name: string; image_url: string; is_private_message: boolean }
    chatProfile.value = {
      name: user.name,
      image: user.image_url,
      loading: false,
      isPrivateMessage: user.is_private_message,
    }
  }
}

onMounted(fetchProfile)
</script>
