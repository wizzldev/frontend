<template>
  <li
    class="text-3xl relative cursor-pointer px-4 py-1.5 w-max max-w-full break-words"
    :class="{'ml-auto': sentByMe}"
    @dblclick="$emit('like', message.id)"
  >
    <p v-once>
      <template v-for="emoji in emojis">
        <img v-if="emoji.isImage" class="w-8 h-8 inline-block" :alt="emoji.emoji" :title="emoji.emoji" :src="emoji?.src" />
        <template v-else>
          {{ emoji.emoji }}
        </template>
      </template>
    </p>
  </li>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import { computed } from 'vue'

const props = defineProps<{
  sentByMe: boolean
  message: Message
}>()

const emojis = computed(() => {
  const emojis = props.message.content.split(':').filter(c => c != '')
  const out = [] as Array<{emoji: string, isImage: boolean, src: string|undefined}>
  console.log("EMOJI", emojis)
  for(let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i]
    if(isEmoji(emoji)) out.push({emoji, isImage: false, src: undefined})
    else out.push({emoji: `:${emoji}:`, isImage: true, src: '/star.svg' })
  }
  return out
})


const isEmoji = (content: string) => {
  const pattern = /^(?:(?:\p{RI}\p{RI}|\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(?:\u{200D}\p{Emoji}(?:\p{Emoji_Modifier}|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)*)|[\u{1f900}-\u{1f9ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}])+$/u;
  return pattern.test(content)
}
</script>