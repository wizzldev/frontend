<template>
  <SettingsLayout>
    <section class="mx-2 mb-3 mt-5 text-center">
      <LazyImage
        class="w-16 h-16 rounded-lg mx-auto"
        :alt="auth.user?.first_name + '\'s profile image'"
        :src="cdnImage(auth.user?.image_url || '', 128)"
      />
      <h2 class="mt-1 fontTheme" v-emoji>{{ auth.user?.first_name }} {{ auth.user?.last_name }}</h2>
      <SettingsButton class="text-sm" @click="editProfileImage = true">
        {{ $t('Edit profile image') }}
      </SettingsButton>
    </section>
    <EditUserInfo />
    <Notifications />
    <AccountSecurity />
    <DeveloperSettings />
    <DangerZone />
    <BuildInfo />
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
import { useAuth2Store } from '@/stores/auth2'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import Modal from '@/components/Modals/Modal.vue'
import { ref } from 'vue'
import ProfileImageCropper from '@/components/Settings/ProfileImageCropper.vue'
import SettingsButton from '@/components/Settings/SettingsButton.vue'
import BuildInfo from '@/components/Settings/BuildInfo.vue'
import EditUserInfo from '@/components/Settings/EditUserInfo.vue'
import AccountSecurity from '@/components/Settings/AccountSecurity.vue'
import DangerZone from '@/components/Settings/DangerZone.vue'
import Notifications from '@/views/Settings/Notifications.vue'
import DeveloperSettings from '@/components/Settings/DeveloperSettings.vue'

const auth = useAuth2Store()
const editProfileImage = ref(false)

const updateImage = (key: string) => {
  if (!auth.user) return
  auth.user.image_url = key
}
</script>
