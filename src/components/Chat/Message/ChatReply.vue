<template>
  <p class="text-xs text-gray-400">{{ getReply }}</p>
  <div class="bg-tertiary rounded-3xl mb-0.5"  v-if="reply.type == 'message'">
    <p class="px-3 py-1.5">
      <span>{{ reply.content }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  reply: Message
  senderName: string
  sentByMe: boolean
}>()

const i18n = useI18n()

const getReply = computed(() => {
  if(props.sentByMe) return i18n.t('message.reply.you', {to: props.reply.sender.first_name})
  return i18n.t('message.reply', {who: props.senderName, to: props.reply.sender.first_name})
})
</script>