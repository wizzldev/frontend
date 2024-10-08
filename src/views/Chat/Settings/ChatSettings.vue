<template>
  <ChatSettingsLayout
    :chat-profile="chatProfile"
    :connection="{ connected: true, error: false }"
    :theme="undefined"
    :isYou="false"
    to-name="chat.message"
    :to-params="{ id: $route.params.id }"
  >
    <header class="px-4 my-4 text-center">
      <LazyImage
        :alt="chatProfile.name"
        :src="cdnImage(chatProfile.image)"
        class="w-14 h-14 rounded-lg mx-auto"
      />
      <h2 class="text-center fontTheme" v-emoji>{{ chatProfile.name }}</h2>
      <SettingsButton
        v-if="!chatProfile.isPrivateMessage && yourRoles.includes(Roles.EditGroupImage)"
        class="text-sm"
        @click="editProfileImage = true"
      >
        {{ $t('Edit profile image') }}
      </SettingsButton>
    </header>
    <main class="px-4 my-2" v-if="loaded">
      <EditName
        v-if="!chatProfile.isPrivateMessage && yourRoles.includes(Roles.EditGroupName)"
        :name="chatProfile.name"
      />
      <div>
        <Invite
          v-if="!chatProfile.isPrivateMessage && yourRoles.includes(Roles.Creator)"
          @reload="fetchProfile"
          :is-private-message="chatProfile.isPrivateMessage"
          :special-invite="chatProfile.custom_invite"
          :your-roles="yourRoles"
        />
        <EmojiSetting
          v-if="chatProfile.isPrivateMessage || yourRoles.includes(Roles.Admin)"
          :emoji="chatProfile.emoji"
          @reload="fetchProfile"
        />
        <PushButton
          :is-link="true"
          to-name="chat.theme"
          :to-params="{ id: $route.params.id }"
          v-if="chatProfile.isPrivateMessage || yourRoles.includes(Roles.EditGroupTheme)"
          class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        >
          {{ $t('Edit theme') }}
        </PushButton>
        <ChatGroup title="Roles & Permissions">
          <PushButton
            v-if="!chatProfile.isPrivateMessage && yourRoles.includes(Roles.Admin)"
            toName="chat.roles"
            :to-params="{ id: $route.params.id as string }"
            :is-link="true"
            class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
          >
            {{ $t('Edit roles') }}
          </PushButton>

          <PushButton
            :is-link="true"
            to-name="chat.members"
            :to-params="{ id: route.params.id as string }"
            class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
          >
            {{ $t('Members') }}
          </PushButton>
        </ChatGroup>

        <ChatGroup
          title="Request data access"
          v-if="chatProfile.isPrivateMessage || yourRoles.includes(Roles.Admin)"
        >
          <PushButton
            v-if="chatProfile.isPrivateMessage || yourRoles.includes(Roles.Creator)"
            :is-link="false"
            class="transition-colors w-full text-white bg-secondary-all py-2 rounded-xl fontTheme flex items-center space-x-2 justify-center"
          >
            {{ $t('Download group data in JSON') }}
          </PushButton>
        </ChatGroup>
      </div>
    </main>
  </ChatSettingsLayout>

  <Modal :show="editProfileImage" @close="editProfileImage = false">
    <ProfileImageCropper
      :image="chatProfile.image"
      :resource="`/chat/${route.params.id as string}/group-image`"
      @uploaded="handleUpload"
    />
  </Modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { cdnImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import SettingsButton from '@/components/Settings/SettingsButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import ProfileImageCropper from '@/components/Settings/ProfileImageCropper.vue'
import { useChatStore } from '@/stores/chat'
import { useContactsStore } from '@/stores/contacts'
import PushButton from '@/components/Elements/PushButton.vue'
import { fetchInfo, getChatProfileRef } from '@/views/Chat/Settings/fetchInfo'
import EditName from '@/components/Group/EditName.vue'
import ChatGroup from '@/views/Chat/Settings/ChatGroup.vue'
import { Roles } from '@/scripts/roles'
import Invite from '@/views/Chat/Settings/Invite.vue'
import EmojiSetting from '@/views/Chat/Settings/EmojiSetting.vue'
import ChatSettingsLayout from '@/layouts/ChatSettingsLayout.vue'

const route = useRoute()
const contacts = useContactsStore()
const chat = useChatStore()
const chatProfile = getChatProfileRef()
const editProfileImage = ref(false)
const yourRoles = ref<Array<string>>([])
const loaded = ref(false)

const fetchProfile = async () => {
  const { user, your_roles } = await fetchInfo(route.params.id as string)
  if (!user) return
  chatProfile.value = user
  loaded.value = true
  if (!your_roles) return
  yourRoles.value = your_roles
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
