<template>
  <template v-if="['message', 'emoji'].includes(messages.type)">
    <MessagerWrap :sent-by-me="sentByMe" :sender="messages.sender" :theme="theme">
      <ul class="h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse !text-white overflow-hidden text-ellipsis" :class="{'col-span-4': sentByMe, customTheme: theme}">
        <MessageWrap
          v-for="msg in messages.messages" :key="msg.id"
          :sentByMe="sentByMe"
          :isEmoji="msg.type == 'emoji'"
          :likes="msg.likes"
          @dblclick="$emit('like', msg.id)"
          :theme="theme"
          v-use-longpress="200"
          @longpress="onLongPress(msg)"
        >
          <ChatReply v-if="msg.reply" :reply="msg.reply" :sent-by-me="sentByMe" :sender-name="msg.sender.first_name" />
          <ChatMessage v-if="msg.type == 'message'" :message="msg" :sent-by-me="sentByMe" :place="getPlace(msg)" />
          <ChatFile v-else-if="msg.type.startsWith('file:')" :message="msg" :sent-by-me="sentByMe" />
          <ChatEmoji v-else-if="msg.type == 'emoji'" :message="msg" />
        </MessageWrap>
      </ul>
    </MessagerWrap>
  </template>
  <div v-else>
    <template v-for="msg in messages.messages" :key="msg.id">
      <DateTimeInfo v-if="msg.type == 'date-time'" :message="msg" />
      <InfoMessage v-else :message="msg" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Message, MessageGroup as MessageGroupType } from '@/types/message'
import { useAuthStore } from '@/stores/auth'
import { computed, type Ref, ref } from 'vue'
import DateTimeInfo from '@/components/Chat/Info/DateTimeInfo.vue'
import MessageWrap from '@/components/Chat/Message/MessageWrap.vue'
import ChatMessage from '@/components/Chat/Message/ChatMessage.vue'
import ChatEmoji from '@/components/Chat/Message/ChatEmoji.vue'
import MessagerWrap from '@/components/Chat/MessagerWrap.vue'
import ChatFile from '@/components/Chat/Message/ChatFile.vue'
import type { ThemeDataMain } from '@/types/chat'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { isApp } from '@/scripts/mobile/isApp'
import ChatReply from '@/components/Chat/Message/ChatReply.vue'
import InfoMessage from '@/components/Chat/Info/InfoMessage.vue'

const props = defineProps<{
  messages: MessageGroupType
  theme: ThemeDataMain | undefined
}>()

let place = ref([]) as Ref<Array<string>>
const emit = defineEmits(['modal', 'like'])
const auth = useAuthStore()

const sentByMe = computed(() => props.messages.sender.id == auth.user?.id)

const onLongPress = async (msg: Message) => {
  if(isApp()) await Haptics.impact({ style: ImpactStyle.Light })
  emit('modal', msg)
}

const getPlace = (msg: Message): Array<string> => {
  const inx = props.messages.messages.indexOf(msg)
  const len = props.messages.messages.length - 1
  console.log(msg, inx, len)
  if(inx == 0 && len == 0) return ['first', 'last']
  if(inx == 0) return ['first']
  if(inx == len) return ['last']
  return ['middle']
}
</script>

<style scoped>
.customTheme * {
  color: v-bind('theme?.text') !important;
}

.customTheme [data-theme='message-you'] {
  background: v-bind('theme?.message.you.bg') !important;
  color: v-bind('theme?.message.you.text') !important;
}

.customTheme [data-theme='message-other'] {
  background: v-bind('theme?.message.other.bg') !important;
  color: v-bind('theme?.message.other.text') !important;
}

.customTheme [data-theme='message-reply'] {
  background: v-bind('theme?.message.you.bg') !important;
  color: v-bind('theme?.message.you.text') !important;
  opacity: 70% !important;
}
</style>
