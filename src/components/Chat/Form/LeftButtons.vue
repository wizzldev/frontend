<template>
  <div>
    <div class="flex items-center space-x-1.5 justify-center">
      <IconButton :class="{ 'theme-icon': theme }" class="iconHover" @click="tools">
        <JoyStick />
      </IconButton>
      <IconButton
        :class="{ 'theme-icon': theme }"
        :disabled="!canAttachFile"
        @click="(fileInput as HTMLInputElement).click()"
      >
        <File />
      </IconButton>
      <IconButton :class="{ 'theme-icon': theme }" @click="emit('audio')">
        <Mic />
      </IconButton>
    </div>
    <form class="hidden">
      <input @change="uploadFile" name="file" type="file" ref="fileInput" />
    </form>
  </div>
</template>
<script setup lang="ts">
import IconButton from '@/components/Chat/Form/IconButton.vue'
import File from '@/components/Icons/File.vue'
import Mic from '@/components/Icons/Mic.vue'
import JoyStick from '@/components/Icons/JoyStick.vue'
import { ref } from 'vue'
import { uploadFileToServer } from '@/components/Chat/Form/uploadFile'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { ThemeDataBottom } from '@/types/theme'

defineProps<{
  canAttachFile: boolean
  theme: ThemeDataBottom | undefined
}>()

const emit = defineEmits(['tools', 'file', 'audio'])
const route = useRoute()
const i18n = useI18n()
const toast = useToast()

const fileInput = ref<HTMLInputElement | null>(null)

const uploadFile = async (e: Event) => {
  const res = await uploadFileToServer(e, route.params.id as string)
  if (res?.data.$error) toast.error(i18n.t(`Failed to upload file: ${res.status}`))
}

const tools = (e: Event) => {
  const target = e.target as HTMLElement
  target.blur()
  emit('tools')
}
</script>

<style scoped>
.iconHover:focus {
  transition: transform 0.7s ease-in-out;
  transform: rotate(360deg);
}

.theme-icon {
  color: v-bind('theme?.icons') !important;
  background-color: v-bind('theme?.input.bg.default') !important;
}
</style>
