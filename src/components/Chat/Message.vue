<template>
  <div
    v-if="messages.type == 'message'"
    class="w-2/3 my-1 mx-3"
    :class="{ 'ml-auto': sentByMe, 'flex items-end space-x-2': !sentByMe, customTheme: theme }"
  >
    <MessageSenderImage v-if="!sentByMe" :image_url="messages.sender.image_url" :first_name="messages.sender.first_name" />
    <div>
      <div v-if="!sentByMe && !messages.messages[0].reply" class="text-xs text-gray-700 ml-2">
        {{ messages.sender.first_name }}
      </div>
      <ul class="max-w-[18rem]">
        <template v-for="msg in messages.messages" :key="msg.id">
          <MessageReply v-if="msg.reply" :message="msg.reply" :sent-by-me="sentByMe" :sender-first-name="messages.sender.first_name" />
          <MessageBox @like="(id: number) => $emit('like', id)" v-if="!isEmoji(msg.content)" :sent-by-me="sentByMe" :message="msg"  />
          <MessageEmoji @like="(id: number) => $emit('like', id)" v-else :sent-by-me="sentByMe" :message="msg" />
          <MessageLike :sent-by-me="sentByMe" :message="msg" />
        </template>
      </ul>
    </div>
  </div>
  <InfoMessages v-else :message-group="messages" />
</template>

<script setup lang="ts">
import type { MessageGroup } from '@/types/message'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import type { ThemeDataMain } from '@/types/chat'
import MessageSenderImage from '@/components/Chat/MessageSenderImage.vue'
import MessageReply from '@/components/Chat/MessageReply.vue'
import MessageBox from '@/components/Chat/MessageBox.vue'
import MessageEmoji from '@/components/Chat/MessageEmoji.vue'
import MessageLike from '@/components/Chat/MessageLike.vue'
import InfoMessages from '@/components/Chat/InfoMessages.vue'

const auth = useAuthStore()

const props = defineProps<{
  messages: MessageGroup
  theme: ThemeDataMain | undefined
}>()

const sentByMe = computed(() => props.messages.sender.id == auth.user?.id)

const isEmoji = (content: string) => {
  const pattern = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
  return pattern.test(content) && Array.from(content).length <= 15
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
