<template>
  <AppLayout>
    <MyProfile :backButton="undefined" />
    <ChatNav class="!py-0" />
    <main class="h-full flex flex-col space-y-3">
      <div class="my-auto text-center mx-5">
        <PushButtonSecondary :isLink="true" to-name="chat.create">
          {{ $t('Create a new chat') }}&nbsp;<Emoji content="😄" />
        </PushButtonSecondary>

        <PushButtonSecondary @click="inviteModal = true">
          {{ $t('Use an invite') }}&nbsp;<Emoji content="🚀" />
        </PushButtonSecondary>

        <PushButtonSecondary @click="v2Feature">
          {{ $t('Global chats') }}&nbsp;<Emoji content="🌐" />
        </PushButtonSecondary>
      </div>
    </main>
  </AppLayout>

  <Modal :show="inviteModal" @close="inviteModal = false">
    <h2 class="text-2xl fontTheme">{{ $t('Enter an invite link') }}</h2>
    <p class="mt-2 text-left text-gray-400 text-sm">
      {{ $t('The invitations should look like this') }}:
      <br />
      <span class="text-white font-bold">{{ host + '/LZVMnBvZYL' }}</span
      >, <span class="text-white font-bold">LZVMnBvZYL</span> {{ $t('or') }}
      <span class="text-white font-bold">{{ domain + '/join/LZVMnBvZYL' }}</span>
    </p>
    <form v-on:submit.prevent class="mt-3">
      <IconInput
        v-model.lazy="invite"
        :value="invite"
        :icon="IconPlusCircle"
        :placeholder="`${host}/LZVMnBvZYL`"
        :has-border="true"
      />
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
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const toast = useToast()
const i18n = useI18n()
const inviteModal = ref(false)
const host = ref(`https://${window.GLOBAL_ENV.INVITE_HOST}`)
const domain = ref(`https://${window.GLOBAL_ENV.DOMAIN}`)
const invite = ref('')
const processing = ref(false)

const submit = async () => {
  processing.value = true
  const id = getID(invite.value)
  if (!id) {
    toast.error(i18n.t('Invalid invite code'))
    processing.value = false
    return
  }
  await router.push({ name: 'chat.invite', params: { code: id } })
  processing.value = false
}

const getID = (uri: string): string | false => {
  const domain = 'wizzl.app'
  const regex = new RegExp(
    `^(https?:\\/\\/)?(join\\.${domain}\\/|${domain}\\/join\\/)?([A-Za-z0-9]{3,15})$`
  )
  const match = uri.match(regex)

  if (match && match[3]) {
    return match[3]
  }

  return false
}

const v2Feature = () => {
  toast.info(i18n.t('V2 Feature\nCurrently unavailable'))
}
</script>
