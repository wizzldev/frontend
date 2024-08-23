<template>
  <Modal :show="true" @close="$emit('close')">
    <h2 class="text-2xl fontTheme" v-emoji>{{ $t('Developer settings') }} 💻</h2>
    <p class="mt-2 text-gray-400 text-sm text-center" v-emoji>
      {{ $t('Be careful who you share data with!') }} ❗
    </p>
    <div class="mt-3">
      <DevSettingsButton @click="copyText(contact.id.toString())" class="flex items-center justify-center space-x-2">
        <span>{{ $t('Copy group ID') }}</span>
        <Clipboard/>
      </DevSettingsButton>

      <DevSettingsButton @click="copyText(contact.image)" class="flex items-center justify-center space-x-2">
        <span>{{ $t('Copy group image url') }}</span>
        <Clipboard/>
      </DevSettingsButton>

      <DevSettingsButton @click="soon" class="flex items-center justify-center space-x-2">
        <span>{{ $t('Invite a BOT') }}</span>
        <Bot/>
      </DevSettingsButton>

      <DevSettingsButton @click="$router.push('/__dev/logs')" class="flex items-center justify-center space-x-2">
        <span>{{ $t('See application log') }}</span>
        <LogFile/>
      </DevSettingsButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modals/Modal.vue'
import type { Contact } from '@/types/contact'
import DevSettingsButton from '@/components/Group/DevSettingsButton.vue'
import Clipboard from '@/components/Icons/Clipboard.vue'
import Bot from '@/components/Icons/Bot.vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import File from '@/components/Icons/File.vue'
import LogFile from '@/components/Icons/LogFile.vue'

defineProps<{
  contact: Contact
}>()

const { info } = useToast()
const { t } = useI18n()

const soon = () => {
  info(t('Soon...'))
}


const copyText = async (text: string) => {
  await Clipboard.write({
    string: text,
  })
  info(t('Copied to clipboard'))
}
</script>