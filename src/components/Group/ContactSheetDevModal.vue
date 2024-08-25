<template>
  <Modal :show="true" @close="$emit('close')">
    <h2 class="text-2xl fontTheme" v-emoji>{{ $t('Developer settings') }} 💻</h2>
    <p class="mt-2 text-gray-400 text-sm text-center" v-emoji>
      {{ $t('Be careful who you share data with!') }} ❗
    </p>
    <div class="mt-3">
      <DevSettingsButton @click="copyId" class="flex items-center justify-center space-x-2">
        <span>{{ $t('Copy group ID') }}</span>
        <ClipboardIcon/>
      </DevSettingsButton>

      <DevSettingsButton @click="copyImage" class="flex items-center justify-center space-x-2">
        <span>{{ $t('Copy group image URL') }}</span>
        <ClipboardIcon/>
      </DevSettingsButton>

      <DevSettingsButton @click="soon" class="flex items-center justify-center space-x-2">
        <span>{{ $t('Invite a BOT') }}</span>
        <Bot/>
      </DevSettingsButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modals/Modal.vue'
import type { Contact } from '@/types/contact'
import DevSettingsButton from '@/components/Group/DevSettingsButton.vue'
import { Clipboard } from '@capacitor/clipboard'
import ClipboardIcon from '@/components/Icons/Clipboard.vue'
import Bot from '@/components/Icons/Bot.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  contact: Contact
}>()

const { info } = useToast()
const { t } = useI18n()

const soon = () => {
  info(t('Soon...'))
}


const copyId = async () => {
  await Clipboard.write({
    string: props.contact.id.toString(),
  })
  info(t('Copied to clipboard'))
}


const copyImage = async () => {
  await Clipboard.write({
    string: props.contact.image,
  })
  info(t('Copied to clipboard'))
}
</script>