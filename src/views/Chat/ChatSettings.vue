<template>
  <ChatLayout
    :chat-profile="chatProfile"
    :connection="{ connected: true, error: false }"
    :theme="undefined"
  >
    <header class="px-4 my-4 text-center">
      <LazyImage
        :alt="chatProfile.name"
        :src="cdnImage(chatProfile.image)"
        class="w-14 h-14 rounded-lg mx-auto"
      />
      <h2 class="text-center fontTheme">{{ chatProfile.name }}</h2>
      <SettingsButton
        v-if="!chatProfile.isPrivateMessage"
        class="text-sm"
        @click="editProfileImage = true"
      >
        {{ $t('Edit profile image') }}
      </SettingsButton>
    </header>
    <main class="px-4 my-2 text-gray-500">
      <h4 class="text-sm font-bold">{{ $t('Customize') }}</h4>
      <div>x</div>
    </main>
  </ChatLayout>

  <Modal :show="editProfileImage" @close="editProfileImage = false">
    <ProfileImageCropper
      :image="chatProfile.image"
      :resource="`/chat/${route.params.id as string}/group-image`"
      @uploaded="handleUpload"
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
import { useChatStore } from '@/stores/chat'
import { useContactsStore } from '@/stores/contacts'

const route = useRoute()
const contacts = useContactsStore()
const chat = useChatStore()
const chatProfile = ref({ id: 0, name: '', image: '', isPrivateMessage: false, loading: true })
const editProfileImage = ref(false)

const fetchProfile = async () => {
  const res = await request.get(`/chat/user/${route.params.id as string}`)
  if (!res?.data?.$error) {
    const user = res.data as {
      id: number
      name: string
      image_url: string
      is_private_message: boolean
    }
    chatProfile.value = {
      id: user.id,
      name: user.name,
      image: user.image_url,
      loading: false,
      isPrivateMessage: user.is_private_message
    }
  }
}

const handleUpload = (src: string) => {
  for (let i = 0; i < contacts.contacts.length; i++) {
    if (contacts.contacts[i].id == chatProfile.value.id) {
      contacts.contacts[i].image = src
      break
    }
  }

  if (Object.keys(chat.profile).includes(chatProfile.value.id.toString())) {
    chat.profile[chatProfile.value.id.toString()].image = src
  }
}

onMounted(fetchProfile)
</script>
