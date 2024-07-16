<template>
  <form v-on:submit.prevent class="w-full flex space-x-1.5 items-center justify-center">
    <textarea
      type="text"
      class="transition-all duration-500 no-scrollbar bg-secondary rounded-3xl py-2 px-5 w-full resize-none max-h-24 min-h-10"
      placeholder="Aa"
      required
      ref="textarea"
      v-model="input"
      rows="1"
      :class="{
        'text-orange-400': input?.length > 400 && input?.length <= 500,
        'text-red-400': input?.length > 500,
        'theme-form': theme
      }"
      @focusin="isFocus = true"
      @focusout="isFocus = false"
    />
    <SendButton
      v-if="showSend"
      @click="send"
      :input="input || ''"
      :input-empty="inputEmpty"
      :theme="theme"
    />
  </form>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'
import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue'
import type { ThemeDataBottom } from '@/types/chat'
import SendButton from '@/components/Chat/Form/SendButton.vue'

const props = defineProps<{
  compactView: boolean
  theme: ThemeDataBottom | undefined
}>()

const { textarea, input } = useTextareaAutosize()

const emit = defineEmits(['send', 'showIcons'])

const inputEmpty = computed(() => input.value == '' || input.value == undefined)
const isFocus = ref(false)
const showSend = computed(() => isFocus.value || (!inputEmpty.value && !props.compactView))

const send = () => {
  if (input?.value == '') return
  emit('send', input.value)
  input.value = ''
}

watch(showSend, (s) => {
  emit('showIcons', !s)
})

const handleSpace = (e: KeyboardEvent) => {
  if(e.code == 'Space' || e.key == " ") textarea.value.focus()
}

onBeforeMount(() => {
  input.value = ''
  document.addEventListener('keyup', handleSpace)
})

onUnmounted(() => document.removeEventListener('keyup', handleSpace))
</script>

<style scoped>
textarea {
  transition: width 2s;
}

.theme-form {
  background: v-bind('theme?.input.bg.focus') !important;
  color: v-bind('theme?.input.text.focus') !important;
}
</style>
