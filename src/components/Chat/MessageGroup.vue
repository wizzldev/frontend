<template>
  <template v-if="['message', 'emoji'].includes(messages.type)">
    <div
      class="no-scrollbar h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse !text-white overflow-hidden text-ellipsis"
      :class="{
        'col-span-4': sentByMe,
        customTheme: theme
      }"
    >
      <MessagerWrap :is-bot="messages.sender.is_bot" :sent-by-me="sentByMe" :sender="messages.sender" :theme="theme" :isPM="isPM">
        <MessageWrap
          v-for="msg in messages.messages"
          :key="msg.id"
          :message="msg"
          :sentByMe="sentByMe"
          :isEmoji="msg.type == 'emoji'"
          :likes="msg.likes"
          @dblclick="$emit('like', msg.id)"
          :theme="theme"
          ref="msgWrap"
          @modal="emitModal"
          @reply="$emit('reply', msg)"
        >
          <ChatReply
            v-if="msg.reply"
            :reply="msg.reply"
            :sent-by-me="sentByMe"
            :sender-name="msg.sender.first_name"
            :isPM="isPM"
          />
          <ChatMessage
            v-if="msg.type == 'message'"
            :message="msg"
            :sent-by-me="sentByMe"
            :place="getPlace(msg)"
            :theme="theme"
          />
          <DeletedMessage
            v-if="msg.type == 'deleted'"
            :sent-by-me="sentByMe"
            :place="getPlace(msg)"
            :theme="theme"
          />
          <ChatFile
            v-else-if="msg.type.startsWith('file:')"
            :message="msg"
            :sent-by-me="sentByMe"
            @showImage="(img: string) => emit('showImage', img)"
            :theme="theme"
          />
          <ChatEmoji :sent-by-me="sentByMe" v-else-if="msg.type == 'emoji'" :message="msg" />
        </MessageWrap>
      </MessagerWrap>
    </div>
  </template>
  <div v-else class="px-2 my-3">
    <template v-for="(msg, inx) in infoMessages" :key="msg.id">
      <template v-if="inx < 3 || showAllInfo">
        <DateTimeInfo :theme="theme" v-if="msg.type == 'date-time'" :message="msg" />
        <InfoMessage :theme="theme" v-else :message="msg" />
      </template>
    </template>
    <div class="w-full flex items-center justify-center mt-2">
      <button class="transition-colors text-center text-xs text-purple-400 px-2 py-0.5 rounded-lg hover:bg-secondary focus:bg-secondary" @click="showAllInfo = !showAllInfo" v-if="infoMessages.length > 3">
        {{ showAllInfo ? $t('Collapse') : showMoreText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, MessageGroup as MessageGroupType } from '@/types/message'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import DateTimeInfo from '@/components/Chat/Info/DateTimeInfo.vue'
import MessageWrap from '@/components/Chat/Message/MessageWrap.vue'
import ChatMessage from '@/components/Chat/Message/ChatMessage.vue'
import ChatEmoji from '@/components/Chat/Message/ChatEmoji.vue'
import MessagerWrap from '@/components/Chat/MessagerWrap.vue'
import ChatFile from '@/components/Chat/Message/ChatFile.vue'
import type { ThemeDataMain } from '@/types/chat'
import ChatReply from '@/components/Chat/Message/ChatReply.vue'
import InfoMessage from '@/components/Chat/Info/InfoMessage.vue'
import DeletedMessage from '@/components/Chat/Message/DeletedMessage.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  messages: MessageGroupType
  theme: ThemeDataMain | undefined
  isPM: boolean
}>()

const emit = defineEmits(['modal', 'like', 'reply', 'showImage'])
const auth = useAuthStore()
const showAllInfo = ref(false)
const i18n = useI18n()

const sentByMe = computed(() => props.messages.sender.id == auth.user?.id)

const getPlace = (msg: Message): Array<string> => {
  const inx = props.messages.messages.indexOf(msg)
  const len = props.messages.messages.length - 1
  if (inx == 0 && len == 0) return ['first', 'last']
  if (inx == 0) return ['first']
  if (inx == len) return ['last']
  return ['middle']
}

const infoMessages = computed(() => {
  const msg = props.messages.messages
  return msg.reverse()
})

const emitModal = (msg: Message) => {
  if (msg.type != 'deleted') emit('modal', msg)
}

const showMoreText = computed(() => i18n.t('Show {count} more', {count: infoMessages.value.length - 3}))
</script>
