<template>
  <div>
    <h1 class="fontTheme text-2xl">{{ $t('Edit image') }}</h1>
    <div class="min-h-[200px] h-[200px] mx-auto mt-2">
      <Cropper
        v-if="srcURL && !uploading"
        class="m-auto h-[200px]"
        :src="srcURL"
        :autoZoom="true"
        :stencil-props="{
          aspectRatio: 1,
          previewClass: 'cropper-preview'
        }"
        @change="updateCanvas"
        :stencil-component="CircleStencil"
        :disabled="uploading"
      />
      <img
        v-else-if="!uploading"
        :src="cdnImage(image)"
        alt="Image"
        class="w-[200px] h-[200px] m-auto rounded"
      />
      <img v-else :src="canvasData" alt="Image" class="w-[200px] h-[200px] m-auto rounded" />
    </div>
    <button
      v-if="!srcURL"
      @click="fileUpload?.click()"
      class="rounded-full bg-tertiary-all mt-2 px-4 py-1"
    >
      {{ $t('Upload an image') }}
    </button>
    <div class="flex items-center justify-center space-x-2" v-else>
      <button
        :disabled="uploading"
        @click="upload"
        class="rounded-full flex items-center space-x-2 transition-colors duration-150 bg-purple-500 hover:bg-purple-400 focus:bg-purple-600 mt-2 px-4 py-1"
      >
        <span>{{ $t('Save') }}</span>
        <Spinner v-if="uploading" />
      </button>
      <button @click="src = null" class="rounded-full bg-tertiary-all mt-2 px-4 py-1">
        {{ $t('Discard') }}
      </button>
    </div>
  </div>
  <form class="hidden">
    <input @change="onUpload" type="file" accept="image/*" ref="fileUpload" />
  </form>
</template>
<script setup lang="ts">
import { cdnImage } from '@/scripts/image'
import { Cropper, CircleStencil, type CropperResult } from 'vue-advanced-cropper'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import Spinner from '@/components/Icons/Spinner.vue'
import request from '@/scripts/request/request'

const props = defineProps<{
  image: string
  resource: string
  imageKey?: string | undefined
}>()

const emit = defineEmits(['uploaded'])
const toast = useToast()
const i18n = useI18n()
const src = ref<File | null>(null)
const fileUpload = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const canvasData = ref('')

const updateCanvas = (res: CropperResult) => {
  const canvas = res.canvas
  if (!canvas) {
    toast.error(i18n.t('Failed to export image'))
    return
  }
  canvasData.value = canvas.toDataURL('image/webp', 100)
}

const onUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files
  if (!files || files.length < 1) return
  src.value = files[0]
}

const srcURL = computed(() => (src.value ? URL.createObjectURL(src.value) : null))

const upload = async () => {
  uploading.value = true
  const data = new FormData()
  data.append(props.imageKey || 'image', await getImage())
  const res = await request.post(props.resource, data)
  if (res.data.$error) {
    toast.error(i18n.t('Failed to upload file') + '- Status code:' + res.status)
    return
  }
  emit('uploaded', (res.data as { image_url: string }).image_url)
  uploading.value = false
  src.value = null
}

const getImage = async () => {
  const res = await fetch(canvasData.value)
  return new File([await res.blob()], 'image.webp', { type: 'image/webp' })
}
</script>

<style>
.cropper-preview {
  border: dashed 1px rgba(255, 255, 255, 0.5);
}
</style>
