<template>
  <BottomSheet :visible="visible" @close="$emit('close')">
    <header class="border-b border-tertiary">
      <h2 class="m-5 text-lg">
        {{ contact.name }}
        <VerifiedBadge class="text-yellow-400" v-if="contact.is_verified" />
      </h2>
    </header>
    <main>
      <SheetButton :icon="Link" @click="goTo">
        {{ $t('Open chat') }}
      </SheetButton>
      <SheetButton @click="copyInvite" :icon="ClipboardIcon" v-if="contact.custom_invite">
        {{ $t('Copy special invite') }}
      </SheetButton>
      <SheetButton :icon="ShareIcon" @click="share" v-if="contact.custom_invite && isApp()">
        {{ $t('Share group') }}
      </SheetButton>
      <SheetButton :icon="Trash">
        {{ $t('Delete') }}
      </SheetButton>
      <SheetButton v-if="contact.is_private_message" :icon="Block">
        {{ $t('Block') }}
      </SheetButton>
      <SheetButton :icon="Leave" v-else>
        {{ $t('Leave group') }}
      </SheetButton>
    </main>
  </BottomSheet>
</template>
<script setup lang="ts">
import BottomSheet from '@/components/BottomSheet.vue'
import type { Contact } from '@/types/contact'
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import SheetButton from '@/components/SheetButton.vue'
import Trash from '@/components/Icons/Trash.vue'
import Block from '@/components/Icons/Block.vue'
import Leave from '@/components/Icons/Leave.vue'
import Link from '@/components/Icons/Link.vue'
import ClipboardIcon from '@/components/Icons/Clipboard.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { Clipboard } from '@capacitor/clipboard'
import ShareIcon from '@/components/Icons/Share.vue'
import { Share } from '@capacitor/share'
import { computed } from 'vue'
import { isApp } from '@/scripts/mobile/isApp'

const props = defineProps<{
  visible: boolean
  contact: Contact
}>()

const router = useRouter()
const { t } = useI18n()
const { info } = useToast()

const goTo = () => {
  router.push({ name: 'chat.message', params: { id: props.contact.id.toString() } })
}

const customInvite = computed(() => `https://${window.GLOBAL_ENV.INVITE_HOST}/${props.contact.custom_invite}`)

const copyInvite = async () => {
  await Clipboard.write({
    string: customInvite.value
  })
  info(t('Copied to clipboard'))
}

const share = async () => {
  if(isApp()) await Share.share({
    title: `Join ${props.contact.name} on Wizzl`,
    text: `You've been invited to join an awesome group on Wizzl. Join now chat about anything you like!`,
    url: customInvite.value,
    dialogTitle: 'Share with friends',
  })
}
</script>