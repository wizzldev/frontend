<template>
  <BottomSheet :visible="visible" @close="$emit('close')">
    <header class="border-b border-tertiary">
      <h2 class="m-5 text-lg flex items-center space-x-1">
        <span v-emoji>{{ realTitle }}</span>
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
      <SheetButton :icon="ShareIcon" @click="share" v-if="contact.custom_invite && canShare()">
        {{ $t('Share group') }}
      </SheetButton>
      <SheetButton v-if="contact.is_private_message" :icon="Block">
        {{ $t('Block') }}
      </SheetButton>
      <SheetButton @click="leave" :icon="Leave" v-else-if="contact.creator_id != user?.id">
        {{ $t('Leave group') }}
      </SheetButton>
      <SheetButton @click="delStart = true" v-if="!contact.is_private_message && contact.creator_id == user?.id" :icon="Trash">
        {{ $t('Delete group') }}
      </SheetButton>
      <SheetButton @click="devModal = true" :icon="CurlyBrackets">
        {{ $t('Developer settings') }}
      </SheetButton>
    </main>
  </BottomSheet>

  <ContactSheetDeleteModal v-if="delStart" @delete="del" @close="delStart = false"  />
  <ContactSheetDevModal v-if="devModal" @close="devModal = false" :contact="contact" />
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
import { computed, ref } from 'vue'
import { isApp } from '@/scripts/mobile/isApp'
import { useAuth2Store } from '@/stores/auth2'
import request from '@/scripts/request/request'
import { useContactsStore } from '@/stores/contacts'
import { getRealUserName } from '@/scripts/getRealUserName'
import CurlyBrackets from '@/components/Icons/CurlyBrackets.vue'
import ContactSheetDeleteModal from '@/components/Group/ContactSheetDeleteModal.vue'
import ContactSheetDevModal from '@/components/Group/ContactSheetDevModal.vue'

const props = defineProps<{
  visible: boolean
  contact: Contact
}>()

const router = useRouter()
const { t } = useI18n()
const { info, error } = useToast()
const { user } = useAuth2Store()
const contacts = useContactsStore()
const delStart = ref(false)
const devModal = ref(false)

const emit = defineEmits(['close'])

const realTitle = computed(() => getRealUserName(props.contact.name))

const goTo = () => {
  router.push({ name: 'chat.message', params: { id: props.contact.id.toString() } })
}

const customInvite = computed(() => `https://${window.GLOBAL_ENV.INVITE_HOST}/${props.contact.custom_invite}`)
const shareData = computed(() => {
  return {
    title: `Join ${props.contact.name} on Wizzl`,
    text: `You've been invited to join an awesome group on Wizzl. Join now chat about anything you like!`,
    url: customInvite.value,
    dialogTitle: 'Share with friends',
  }
})

const copyInvite = async () => {
  await Clipboard.write({
    string: customInvite.value
  })
  info(t('Copied to clipboard'))
}

const share = async () => {
  if(isApp()) {
    await Share.share(shareData.value)
    return
  }

  if(canShare()) await navigator.share(shareData.value)
}

const canShare = (): boolean => {
  if(isApp()) return true

  if(!navigator.canShare) return false

  return navigator.canShare(shareData.value);
}

const leave = async () => {
  const res = await request.get(`/chat/${props.contact.id}/leave`)
  if(res.data.$error) error(t('Failed to leave the group'))
  else {
    info(t('Successfully left the group'))
    contacts.removeByID(props.contact.id)
  }
}

const del = async () => {
  const res = await request.delete(`/chat/${props.contact.id}`)
  if(res.data.$error) error(t('Failed to delete the group'))
  else {
    info(t('Successfully deleted'))
    contacts.removeByID(props.contact.id)
    delStart.value = false
    emit('close')
  }
}
</script>