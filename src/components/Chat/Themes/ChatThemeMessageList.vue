<script setup lang="ts">
import type { ThemeDataMain } from '@/types/theme'
import ChatMessage from '@/components/Chat/Message/ChatMessage.vue'
import MessagerWrap from '@/components/Chat/MessagerWrap.vue'
import { ref } from 'vue'
import type { User } from '@/types/user'
import type { Message } from '@/types/message'
import { useAuth2Store } from '@/stores/auth2'
import { useI18n } from 'vue-i18n'

defineProps<{
  theme?: ThemeDataMain
}>()

const { t } = useI18n()
const { user } = useAuth2Store()

const wizzl = {
  id: 0,
  first_name: '',
  last_name: '',
  image_url: 'wizzl.webp',
  email: '',
  is_bot: false,
  is_verified: true
} as User

const newMessage = (content: string, sender: User) =>
  ({
    id: 0,
    sender,
    content,
    type: 'message',
    data_json: null
  }) as Message

const data = ref([
  {
    message: newMessage(t('theme.Hi') + ' 😁', wizzl),
    place: ['last']
  },
  {
    message: newMessage(t('theme.How are you?'), wizzl),
    place: ['first']
  },
  {
    message: newMessage(t('theme.Hi'), user as User),
    place: ['last']
  },
  {
    message: newMessage(t("theme.I'm fine, wbu?") + ' 😄', user as User),
    place: ['first']
  }
])
</script>

<template>
  <ul class="px-2 py-1.5">
    <li class="my-0.5" v-for="m in data" :key="m.message.id">
      <MessagerWrap
        :is-bot="m.message.sender.is_bot"
        :sent-by-me="m.message.sender.id != 0"
        :sender="m.message.sender"
        :is-p-m="false"
        :theme="theme"
      >
        <ChatMessage
          :sent-by-me="m.message.sender.id != 0"
          :theme="theme"
          :place="m.place"
          :message="m.message"
        />
      </MessagerWrap>
    </li>
  </ul>
</template>
