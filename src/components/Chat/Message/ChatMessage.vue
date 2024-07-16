<template>
  <div
    v-if="snippets.filter((s) => s.is_code).length == 0"
    class="cursor-pointer w-max max-w-full rounded-lg break-words whitespace-pre-wrap z-0"
    :class="{
      'bg-secondary rounded-l-3xl ml-auto': sentByMe,
      'bg-tertiary rounded-r-3xl': !sentByMe,
      'rounded-b-3xl': place.includes('first'),
      'rounded-t-3xl': place.includes('last'),
      customBg: theme
    }"
  >
    <p class="px-4 py-1.5" :class="{ customText: theme }" v-emoji>
      {{ message.content }}
    </p>
  </div>
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
      <p class="px-4 py-1.5" v-if="!m.is_code">{{ m.content }}</p>
      <div v-else>
        <div
          class="px-2 py-1 w-full flex items-center justify-between rounded-t text-xs text-gray-300 border"
          :class="{
            '!bg-secondary border-secondary': !sentByMe,
            '!bg-tertiary border-tertiary': sentByMe
          }"
        >
          <h3>{{ m.lang || 'unknown' }}</h3>
          <p>Copy</p>
        </div>
        <pre
          v-highlightjs
        ><code :class="[m.lang, 'rounded-lg rounded-t-none border border-t-0', {'!bg-secondary border-tertiary': sentByMe, '!bg-tertiary border-secondary': !sentByMe}]">{{ m.content }}</code></pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/chat'
import { computed, onMounted, ref } from 'vue'
import { stringBetween } from '@/scripts/stringBetween'

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
const color = computed(() =>
  props.sentByMe ? props.theme?.message?.you.text : props.theme?.message?.other.text
)

const codify = () => {
  snippets.value = stringBetween(['```', '```'])(props.message.content)
}

onMounted(codify)
</script>

<style scoped>
.customText {
  color: v-bind('color') !important;
}
.customBg {
  background-color: v-bind('bg') !important;
}
</style>
