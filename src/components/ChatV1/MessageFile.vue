<template>
  <li
    data-message
    :data-theme="`message-${sentByMe ? 'you' : 'other'}`"
    class="relative cursor-pointer mt-1 rounded-xl break-words first:rounded-t-3xl last:rounded-b-3xl"
    :class="{
      'ml-auto bg-secondary rounded-l-3xl z-0': sentByMe,
      'bg-tertiary rounded-r-3xl': !sentByMe
    }"
    :style="getStyle(message)"
    @dblclick="$emit('like', message.id)"
  >
    <img
      class="rounded-t-xl w-full"
      v-if="file && file.content_type.startsWith('image/')"
      :src="chatImage(fileInfo.fetchFrom + `?access_token=${fileInfo.accessToken}`)"
      :alt="file.name"
    />
    <div class="px-4 py-2 w-max max-w-full flex space-x-3 items-center justify-between">
      <Spinner v-if="file == null" />
      <template v-else>
        <button
          @click="download"
          :disabled="downloading"
          class="transition w-7 h-7 bg-tertiary hover:bg-tertiary-hover rounded-full flex items-center justify-center"
        >
          <Download v-if="!downloading" />
          <Spinner v-else />
        </button>
        <div>
          <h1 class="font-bold text-ellipsis text-nowrap overflow-hidden line-clamp-1">
            {{ file.name }}
          </h1>
          <p class="text-gray-600">{{ prettyBytes(file.size) }}</p>
        </div>
      </template>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import Spinner from '@/components/Icons/Spinner.vue'
import request from '@/scripts/request/request'
import type { FileDataJSON, FileInfo } from '@/types/file'
import { onMounted, type Ref, ref } from 'vue'
import Download from '@/components/Icons/Download.vue'
import prettyBytes from 'pretty-bytes'
import { Buffer } from 'buffer'
import { chatImage } from '@/scripts/image'

const props = defineProps<{
  message: Message
  sentByMe: boolean
}>()

const fileInfo = ref({}) as Ref<FileDataJSON>
const file = ref(null) as Ref<FileInfo | null>
const downloading = ref(false)

const fetchFileInfo = async () => {
  if (props.message.data_json == null) return
  const info = JSON.parse(props.message.data_json) as FileDataJSON
  fileInfo.value = info
  const res = await request.get(info.fetchFrom + '/info', {
    headers: {
      'X-File-Access-Token': info.accessToken
    }
  })
  if (res.data.$error) return
  file.value = res.data
}

const download = async () => {
  downloading.value = true
  const res = await request.get(fileInfo.value.fetchFrom, {
    headers: {
      'X-File-Access-Token': fileInfo.value.accessToken
    },
    responseType: 'blob'
  })
  downloading.value = false
  if (res.data?.$error) return

  const base64 = Buffer.from(await res.data.arrayBuffer(), 'binary').toString('base64')
  const a = document.createElement('a')
  a.setAttribute('href', `data:${file.value?.content_type};base64,${base64}`)
  a.setAttribute('download', file.value?.name || 'unknown')
  a.setAttribute('wizzl-download', fileInfo.value.fetchFrom)
  a.click()
  a.remove()
}

onMounted(fetchFileInfo)

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
