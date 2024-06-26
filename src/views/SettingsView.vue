<template>
  <SettingsLayout>
    <section class="mx-2 my-4 text-center">
      <LazyImage
        class="w-16 h-16 rounded-lg mx-auto"
        :alt="auth.user?.first_name + '\'s profile image'"
        :src="cdnImage(auth.user?.image_url || '', 128)"
      />
      <h2 class="mt-1 fontTheme">{{ auth.user?.first_name }} {{ auth.user?.last_name }}</h2>
      <SettingsButton class="text-sm" @click="editProfileImage = true">
        {{ $t('Edit profile image') }}
      </SettingsButton>
    </section>
    <section></section>
  </SettingsLayout>
  <Modal :show="editProfileImage" @close="editProfileImage = false">
    <ProfileImageCropper
      @uploaded="updateImage"
      :image="auth.user?.image_url || ''"
      resource="/me/profile-image"
    />
  </Modal>
</template>

<script setup lang="ts">
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import Modal from '@/components/Modals/Modal.vue'
import { ref } from 'vue'
import ProfileImageCropper from '@/components/Settings/ProfileImageCropper.vue'
import SettingsButton from '@/components/Settings/SettingsButton.vue'

const auth = useAuthStore()
const editProfileImage = ref(false)

const updateImage = (key: string) => {
  if (!auth.user) return
  auth.user.image_url = key
}
</script>
