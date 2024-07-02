<template>
  <form v-on:submit.prevent class="w-full flex space-x-1.5 items-center justify-center">
    <textarea
      data-theme="input-form"
      type="text"
      class="duration-150 no-scrollbar bg-secondary border-2 border-secondary rounded-3xl py-2 px-5 w-full resize-none max-h-24 min-h-10"
      placeholder="Aa"
      required
      ref="textarea"
      v-model="input"
      rows="1"
      :class="{
        'text-orange-400': input?.length > 400 && input?.length <= 500,
        'text-red-400': input?.length > 500,
      }"
      @focusin="isFocus = true"
      @focusout="isFocus = false"
    />
    <button
      @click="send"
      v-if="showSend"
      :disabled="input?.length >= 500"
      class="transition-colors duration-500 flex items-center justify-center rounded-full p-2 w-9 h-9 min-w-9 min-h-9 disabled:!bg-red-400 disabled:cursor-not-allowed"
      :class="{
        'bg-secondary border-secondary': inputEmpty,
        'bg-purple-500 border-purple-500 hover:bg-purple-400 hover:border-purple-400 focus:bg-purple-600 focus:border-purple-600': !inputEmpty
      }"
    >
      <Send class="!w-4 !h-4" />
    </button>
  </form>
</template>

<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'
import Send from '@/components/Icons/Send.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'

const props = defineProps<{
  compactView: boolean
}>()

const { textarea, input } = useTextareaAutosize()

const emit = defineEmits(['send', 'showIcons'])

const inputEmpty = computed(() => input.value == '' || input.value == undefined)
const isFocus = ref(false)
const showSend = computed(() => isFocus.value || !inputEmpty.value && !props.compactView)

const send = () => {
  if(input?.value == '') return
  emit('send', input.value)
  input.value = ''
}

watch(showSend, (s) => {
  emit('showIcons', !s)
})

onBeforeMount(() => input.value = '')
</script>

<style scoped>
textarea {
  transition: width 2s;
}
</style>