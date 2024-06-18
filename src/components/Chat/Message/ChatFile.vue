<template>
  <img class="rounded-t-xl w-full" v-if="file && file.content_type.startsWith('image/')" :src="chatImage(fileInfo.fetchFrom + `?access_token=${fileInfo.accessToken}`)" :alt="file.name" />
  <div class="px-4 py-2 w-full ">
    <Spinner v-if="file == null" />
    <div v-else class="flex space-x-3 items-center justify-between">
      <button @click="download" :disabled="downloading" class="transition w-7 h-7 min-w-7 min-h-7 bg-tertiary hover:bg-tertiary-hover rounded-full flex items-center justify-center ">
        <Download v-if="!downloading" />
        <Spinner v-else />
      </button>
      <div class="ml-2 px-2">
        <h1 class="max-w-full">{{ (file as FileInfo).name }}</h1>
        <p class="text-gray-600">{{ prettyBytes((file as FileInfo).size) }}</p>
      </div>
    </div>
  </div>
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
  if(props.message.data_json == null) return
  const info = JSON.parse(props.message.data_json) as FileDataJSON
  fileInfo.value = info
  const res = await request.get(info.fetchFrom + '/info', {
    headers: {
      'X-File-Access-Token': info.accessToken,
    }
  })
  if(res.data.$error) return
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
  if(res.data?.$error) return

  const base64 = Buffer.from(await res.data.arrayBuffer(), 'binary').toString('base64')
  const a = document.createElement('a')
  a.setAttribute('href',`data:${file.value?.content_type};base64,${base64}`)
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
