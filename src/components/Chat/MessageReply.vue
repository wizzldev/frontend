<template>
  <li class="w-max max-w-full" :class="{ 'ml-auto': sentByMe }">
    <p class="text-xs text-gray-700 px-1">{{ replyMessage(message) }}</p>
    <div
      class="px-4 py-1.5 pb-3 -mb-4 w-max mt-1 rounded-xl max-w-full rounded-t-3xl bg-secondary opacity-50"
      :class="{
                'rounded-l-3xl ml-auto': sentByMe,
                'rounded-r-3xl': !sentByMe
              }"
      data-theme="message-reply"
    >
      <p class="break-words text-ellipsis text-nowrap overflow-hidden line-clamp-2">
        {{ message.content }}
      </p>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  message: Message
  sentByMe: boolean
  senderFirstName: string
}>()

const i18n = useI18n()

const replyMessage = (msg: Message) => {
  if (!props.sentByMe)
    return i18n.t('message.reply', {
      who: props.senderFirstName,
      to: msg.sender.first_name
    })
  return i18n.t('message.reply.you', { to: msg.sender.first_name })
}
</script>