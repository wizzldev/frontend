<template>
  <li

    :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
    class="relative cursor-pointer px-4 py-1.5 w-max max-w-full mt-1 rounded-xl break-words first:rounded-t-3xl last:rounded-b-3xl"
    :class="{
              'ml-auto bg-secondary rounded-l-3xl z-0': sentByMe,
              'bg-tertiary rounded-r-3xl': !sentByMe
            }"
    :style="getStyle(message)"
    @dblclick="$emit('like', message.id)"
  >
    {{ message.content }}
  </li>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'

defineProps<{
  message: Message
  sentByMe: boolean
}>()


const getStyle = (msg: Message) => {
  if (!msg.data_json) return {}
  const json = JSON.parse(msg.data_json)
  const style = {} as {
    background: string | undefined
    color: string | undefined
    border: string | null
  }
  if ('bg' in json) style['background'] = json['bg'] + '!important'
  if ('text' in json) style['color'] = json['text'] + '!important'
  if ('border' in json) style['border'] = json['border'] + '!important'
  return style
}
</script>