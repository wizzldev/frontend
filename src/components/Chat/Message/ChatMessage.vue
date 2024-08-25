<template>
  <SimpleChatMessage
    v-if="snippets.filter((s) => s.is_code).length == 0"
    :sent-by-me="sentByMe"
    :message="message"
    :place="place"
  />
  <div
    v-else
    class="cursor-pointer w-max max-w-full rounded break-words whitespace-pre-wrap z-0"
    :class="{
      'bg-secondary rounded-l-3xl ml-auto': sentByMe,
      'bg-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last'),
      customBg: theme
    }"
  >
    <template v-for="(m, i) in snippets" :key="i">
      <MessageContentParagraph
        v-if="!m.is_code"
        :content="m.content"
        :sent-by-me="sentByMe"
        :theme="theme"
      />
      <CodeMessage v-else :sent-by-me="sentByMe" :m="m" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/theme'
import { computed, onMounted, ref } from 'vue'
import { stringBetween } from '@/scripts/stringBetween'
import SimpleChatMessage from '@/components/Chat/Message/ChatMessage/SimpleChatMessage.vue'
import CodeMessage from '@/components/Chat/Message/ChatMessage/CodeMessage.vue'
import MessageContentParagraph from '@/components/Chat/Message/ChatMessage/MessageContentParagraph.vue'

const props = defineProps<{
  message: Message
  place: Array<string>
  sentByMe: boolean
  theme: ThemeDataMain | undefined
}>()

const snippets = ref<Array<{ content: string; is_code: boolean; lang: string | null }>>([])

const bg = computed(() =>
  props.sentByMe ? props.theme?.message?.you.bg : props.theme?.message?.other.bg
)

const codify = () => {
  snippets.value = stringBetween(['```', '```'])(props.message.content)
}

onMounted(codify)
</script>

<style scoped>
.customBg {
  background-color: v-bind('bg') !important;
}
</style>
