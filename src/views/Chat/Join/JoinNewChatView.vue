<template>
  <AppLayout>
    <MyProfile
      :backButton="undefined"
    />
    <ChatNav class="!py-0" />
    <main class="h-full flex flex-col space-y-3">
      <div class="my-auto text-center mx-5">
        <PushButtonSecondary :isLink="true" to-name="chat.create">
          {{ $t('Create a new chat') }}&nbsp;<Emoji content="😄" />
        </PushButtonSecondary>

        <PushButtonSecondary @click="inviteModal = true">
          {{ $t('Use an invite') }}&nbsp;<Emoji content="🚀" />
        </PushButtonSecondary>

        <PushButtonSecondary>
          {{ $t('Global chats') }}&nbsp;<Emoji content="🌐" />
        </PushButtonSecondary>
      </div>
    </main>
  </AppLayout>

  <Modal :show="inviteModal" @close="inviteModal = false">
    <h2 class="text-2xl fontTheme">{{ $t('Enter an invite link') }}</h2>
    <p class="mt-2 text-left text-gray-400 text-sm">
      {{ $t('The invitations should look like this') }}:
      <br/>
      <span class="text-white font-bold">{{ host + '/LZVMnBvZYL' }}</span>, <span class="text-white font-bold">LZVMnBvZYL</span>
      {{ $t('or') }} <span class="text-white font-bold">{{ domain + '/join/LZVMnBvZYL' }}</span>
    </p>
    <form v-on:submit.prevent class="mt-3">
      <IconInput v-model.lazy="invite" :value="invite" :icon="IconPlusCircle" :placeholder="`${host}/LZVMnBvZYL`" :has-border="true" />
      <PushButton
        @click="submit"
        :loading="processing"
        class="w-full bg-tertiary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
      >
        {{ $t('Join') }}
      </PushButton>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import MyProfile from '@/components/Navigation/MyProfile.vue'
import ChatNav from '@/components/ChatV1/ChatNav.vue'
import PushButtonSecondary from '@/components/Elements/PushButtonSecondary.vue'
import Emoji from '@/components/Emoji.vue'
import Modal from '@/components/Modals/Modal.vue'
import { ref } from 'vue'
import IconInput from '@/components/Elements/IconInput.vue'
import PushButton from '@/components/Elements/PushButton.vue'
import IconPlusCircle from '@/components/Icons/IconPlusCircle.vue'

const inviteModal = ref(false)
const host = ref(`https://${window.GLOBAL_ENV.INVITE_HOST}`)
const domain = ref(`https://${window.GLOBAL_ENV.DOMAIN}`)
const invite = ref('')
const processing = ref(false)

const submit = async () => {
  processing.value = true
  const id = getID(invite.value)
  console.log(id)
}

const getID = (uri: string): string|false => {
  if(!uri.startsWith('https://')) return uri

  const url = new URL(uri)
  if(![window.GLOBAL_ENV.INVITE_HOST, window.GLOBAL_ENV.DOMAIN].includes(url.host)) return false

  const path = url.pathname.substring(1)
  if(url.host == window.GLOBAL_ENV.INVITE_HOST && path.split('/').length === 1) return path

  if(url.host != window.GLOBAL_ENV.DOMAIN) return false
  const parts = path.split('/')
  if(parts.length != 2) return false

  if(parts[0] == 'join') return parts[1]
  return false
}
</script>