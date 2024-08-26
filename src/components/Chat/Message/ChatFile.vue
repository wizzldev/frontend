<template>
  <LazyImage
    class="rounded-t-xl w-full cursor-pointer"
    v-if="file && isImage"
    :src="imageSrc"
    :alt="file.name"
    @click="$emit('showImage', imageSrc)"
  />
  <div
    class="px-4 py-2 w-full rounded-b-xl"
    :class="{
      'bg-secondary': sentByMe,
      'bg-tertiary': !sentByMe,
      'rounded-t-xl': !isImage
    }"
  >
    <Spinner v-if="file == null || fileInfo.justLoad" />
    <div
      v-else
      class="flex space-x-2 items-center justify-between relative w-max max-w-full break-words"
    >
      <button
        @click="download"
        :disabled="downloading"
        class="transition w-7 h-7 min-w-7 min-h-7 bg-tertiary hover:bg-tertiary-hover rounded-full flex items-center justify-center"
      >
        <Download v-if="!downloading" />
        <Spinner v-else />
      </button>
      <div class="ml-2 px-2 max-w-[90%]">
        <h1
          class="w-max max-w-full break-words text-ellipsis text-nowrap overflow-hidden line-clamp-1"
          :class="{ customText: theme }"
        >
          {{ (file as FileInfo).name }}
        </h1>
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
import { computed, onMounted, type Ref, ref } from 'vue'
import Download from '@/components/Icons/Download.vue'
import prettyBytes from 'pretty-bytes'
import { Buffer } from 'buffer'
import { chatImage } from '@/scripts/image'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import type { ThemeDataMain } from '@/types/theme'
import { fileCache } from '@/components/Chat/Message/fileCache'
import { isApp } from '@/scripts/mobile/isApp'
import { Directory, Filesystem } from '@capacitor/filesystem'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useLogger } from '@/stores/logger'

const props = defineProps<{
  message: Message
  sentByMe: boolean
  theme: ThemeDataMain | undefined
}>()

const route = useRoute()
const { info, warning } = useToast()
const { t } = useI18n()
const log = (msg: string) => useLogger().log('Chat.File', msg)

const fileInfo = ref({}) as Ref<FileDataJSON>
const file = ref(null) as Ref<FileInfo | null>
const downloading = ref(false)
const isImage = ref(false)

const mount = async () => {
  const data = await fileCache(props.message.data_json)
  if (!data) return
  fileInfo.value = data.info
  file.value = data.file
  isImage.value = data.isImage
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

  const buffer = Buffer.from(await res.data.arrayBuffer(), 'binary')
  if(isApp()) return saveApp(buffer)

  const base64 = buffer.toString('base64')
  const a = document.createElement('a')
  a.setAttribute('href', `data:${file.value?.content_type};base64,${base64}`)
  a.setAttribute('download', file.value?.name || 'unknown')
  a.setAttribute('wizzl-download', fileInfo.value.fetchFrom)
  a.click()
  a.remove()
}

const saveApp = async (buffer: Buffer) => {
  if(!await checkPermission()) {
    warning(t('Permission denied'))
    return
  }

  const dir = `chat_${route.params.id as string}`
  try {
    await Filesystem.mkdir({
      path: dir,
      directory: Directory.Documents,
    })
  } catch (e: unknown) {
    log(`Directory exists: ${e}`)
  }
  await Filesystem.writeFile({
    path: `${dir}/${file.value?.name}`,
    data: buffer.toString(),
    directory: Directory.Documents,
  })
  info(t('Successfully downloaded'))
}

const checkPermission = async () => {
  const status = await Filesystem.requestPermissions()
  return status.publicStorage == 'granted'
}

onMounted(mount)

const imageSrc = computed(() =>
  chatImage(fileInfo.value.fetchFrom + `?access_token=${fileInfo.value.accessToken}`)
)

const color = computed(() =>
  props.sentByMe ? props.theme?.message?.you.text : props.theme?.message?.other.text
)
</script>

<style scoped>
.customText {
  color: v-bind('color') !important;
}
</style>
