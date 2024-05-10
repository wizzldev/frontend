<template>
  <div
    v-if="messages.type == 'message'"
    class="w-3/4 max-w-sm my-1 mx-3"
    :class="{ 'ml-auto': sentByMe, 'flex items-end space-x-2': !sentByMe }"
  >
    <img
      v-if="!sentByMe"
      class="w-5 h-5 rounded-full"
      :src="messages.sender.image_url"
      :alt="`${messages.sender.first_name}'s profile image`"
    />
    <div>
      <div v-if="!sentByMe && !messages.messages[0].reply" class="text-xs text-gray-700">
        {{ messages.sender.first_name }}
      </div>
      <ul class="max-w-[18rem]">
        <template v-for="msg in messages.messages" :key="msg.id">
          <li v-if="msg.reply" class="w-max max-w-full" :class="{ '!ml-auto mr-2': sentByMe }">
            <p class="text-xs text-gray-700 px-1">{{ replyMessage(msg.reply) }}</p>
            <div
              class="px-4 py-1.5 pb-4 -mb-4 w-max mt-1 rounded-xl max-w-full rounded-t-3xl bg-secondary opacity-50 break-words break-all text-ellipsis text-nowrap overflow-hidden line-clamp-2"
              :class="{
                'rounded-l-3xl': sentByMe,
                'rounded-r-3xl': !sentByMe,
              }"
            >
              {{ msg.reply.content }}
            </div>
          </li>
          <li
            class="relative cursor-pointer px-4 py-1.5 w-max max-w-full mt-1 rounded-xl break-words break-all first:rounded-t-3xl last:rounded-b-3xl"
            :class="{
            'ml-auto bg-secondary rounded-l-3xl': sentByMe,
            'bg-tertiary rounded-r-3xl': !sentByMe,
          }"
            :style="getStyle(msg)"
            @pointerdown="console.log('holding...', msg.id)"
          >
            {{ msg.content }}
          </li>
        </template>
      </ul>
    </div>
  </div>
  <ul v-else class="my-1 text-gray-600 text-sm text-center px-5">
    <li v-for="m in messages.messages" :key="m.id">
      {{ infoMessage(m) }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Message, MessageGroup } from '@/types/message'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const auth = useAuthStore()

const props = defineProps<{
  messages: MessageGroup
}>()

const sentByMe = computed(() => props.messages.sender.id == auth.user?.id)

const infoMessage = (msg: Message) => {
  return i18n.t(msg.type, { sender: msg.sender.first_name })
}

const replyMessage = (msg: Message) => {
  if (!sentByMe.value)
    return i18n.t('message.reply', {
      who: props.messages.sender.first_name,
      to: msg.sender.first_name
    })
  return i18n.t('message.reply.you', { to: msg.sender.first_name })
}

const getStyle = (msg: Message) => {
  if(!msg.data_json) return {}
  const json = JSON.parse(msg.data_json)
  const style = {} as {background: string|undefined, color: string|undefined, border: string|null}
  if('bg' in json) style['background'] = json['bg'] + '!important'
  if('text' in json) style['color'] = json['text'] + '!important'
  if('border' in json) style['border'] = json['border'] + '!important'
  return style
}
</script>