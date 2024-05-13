<template>
  <ul class="my-1 text-gray-600 text-sm text-center px-5">
    <li v-for="m in messageGroup.messages" :key="m.id">
      {{ infoMessage(m) }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Message, MessageGroup } from '@/types/message'
import { useI18n } from 'vue-i18n'

defineProps<{
  messageGroup: MessageGroup
}>()

const i18n = useI18n()

const infoMessage = (msg: Message) => {
  return i18n.t(msg.type, { sender: msg.sender.first_name })
}
</script>