<template>
  <div class="flex items-center space-x-1.5 justify-center">
    <IconButton class="iconHover" @click="emit('tools')">
      <JoyStick />
    </IconButton>
    <IconButton :disabled="!canAttachFile" @click="(fileInput as HTMLInputElement).click()">
      <File />
    </IconButton>
    <IconButton @click="emit('audio')">
      <Mic />
    </IconButton>
  </div>
  <form class="hidden">
    <input @change="uploadFile" name="file" type="file" ref="fileInput" />
  </form>
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

defineProps<{
  canAttachFile: boolean
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
</script>

<style scoped>
.iconHover {
  transition: transform 0.7s ease-in-out;
}

.iconHover:hover {
  transform: rotate(360deg);
}
</style>
