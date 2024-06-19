<template>
  <div class="border-t-2 border-t-secondary px-3 py-2" :class="{ customTheme: theme }">
    <div class="flex items-center space-x-2" v-if="allowed">
      <Slide :duration="0.3">
        <div class="flex items-center space-x-1.5" v-show="showIcons">
          <button v-show="!recording" @click="($refs['fileUploadInput'] as HTMLInputElement).click()" v-tippy="{content: 'Upload file'}" class="transition-colors text-lg w-9 h-9 p-2 flex items-center justify-center rounded-full bg-secondary" data-theme="icons">
            <File />
          </button>
          <button
            @click="record" v-tippy="{content: 'Record audio'}"
            class="transition-colors text-lg w-9 h-9 p-2 flex items-center justify-center rounded-full bg-secondary"
            data-theme="icons"
            :class="{'w-auto px-4 space-x-2': recording}"
          >
            <span v-if="recording">2</span>
            <span><Mic /></span>
          </button>
        </div>
      </Slide>
      <form class="w-full" v-on:submit.prevent="$emit('send')">
        <div
          data-theme="input-form"
          class="bg-secondary rounded-3xl w-full flex items-center space-x-2 transition-[width] duration-300 ease-in-out"
          @focusin="showIcons = false"
          @focusout="showIcons = true"
        >
          <input
            data-theme="input-form"
            type="text"
            class=" bg-secondary rounded-3xl py-2 px-3 pl-5 w-full"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :value="value"
            :placeholder="$t('Message')"
            required
          />
          <button class="py-2 px-3 flex items-center justify-center">
            <Send />
          </button>
        </div>
      </form>
      <Bounce>
        <button
          v-if="value == ''"
          @click="$emit('emoji', theme?.emoji || '✨')"
          class="transition-colors text-md w-9 h-9 p-2 flex items-center justify-center rounded-full hover:bg-tertiary hover:bg-opacity-50"
        >
        <span v-if="theme?.emoji">
          {{ theme.emoji }}
        </span>
          ✨
        </button>
      </Bounce>
    </div>
    <h2 v-else class="fontTheme text-gray-400 text-center px-3">{{ $t('You are not allowed to send a message') }}</h2>
  </div>
  <form ref="fileUploadForm" class="hidden" enctype="multipart/form-data">
    <input name="file" type="file" ref="fileUploadInput" @change="($event) => uploadFile($event)" />
  </form>
</template>

<script setup lang="ts">
import Send from '@/components/Icons/Send.vue'
import type { ThemeDataBottom } from '@/types/chat'
import { onMounted, ref } from 'vue'
import Image from '@/components/Icons/Image.vue'
import File from '@/components/Icons/File.vue'
import StarEmoji from '@/components/Icons/StarEmoji.vue'
import Bounce from '@/components/Transitions/Bounce.vue'
import Slide from '@/components/Transitions/Slide.vue'
import request from '@/scripts/request/request'
import { useRoute } from 'vue-router'
import Mic from '@/components/Icons/Mic.vue'

const props = defineProps<{
  theme: ThemeDataBottom | undefined
  value: string
  allowed: boolean
}>()

const route = useRoute()

const fileUploadForm = ref<HTMLFormElement | null>(null)
const recording = ref(false)

const uploadFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if(!files || files.length < 1) {
    return
  }
  const data = new FormData()
  data.append('file', files[0])
  const res = await request.post(`/chat/${route.params.id as string}/file`, data)
  if(res.data.$error) {
    console.log("fail")
  }
}

const record = () => {
  recording.value = true
}

onMounted(() => console.info("PROPS:", props))

const showIcons = ref(true)
</script>

<style scoped>
.customTheme {
  background: v-bind('theme?.bg') !important;
  color: v-bind('theme?.text') !important;
  border-color: v-bind('theme?.border') !important;
}

.customTheme [data-theme='input-form'],
.customTheme [data-theme='button'] {
  background: v-bind('theme?.input.bg.default') !important;
  color: v-bind('theme?.input.text.default') !important;
}

.customTheme [data-theme='input-form']:hover,
.customTheme [data-theme='button']:hover {
  background: v-bind('theme?.input.bg.hover') !important;
  color: v-bind('theme?.input.text.hover') !important;
}

.customTheme [data-theme='input-form']:focus,
.customTheme [data-theme='button']:focus {
  background: v-bind('theme?.input.bg.focus') !important;
  color: v-bind('theme?.input.text.focus') !important;
}

.customTheme [data-theme='icons'] {
  color: v-bind('theme?.icons');
  background-color: v-bind('theme?.input.bg.default')!important;;
}
</style>
