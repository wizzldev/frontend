<template>
  <div class="py-3 transition-colors hover:bg-secondary text-left" ref="wrap">
    <div class="flex items-center mx-5">
      <div class="flex items-center w-10/12">
        <LazyImage class="rounded-xl w-12 h-12 min-w-12 min-h-12" :src="image" alt="Chat Image" />
        <div class="w-full px-2">
          <h3 class="max-w-full mr-3 flex items-center space-x-1">
            <span class="text-ellipsis text-nowrap overflow-hidden line-clamp-1" v-emoji>{{
              realTitle
            }}</span>
            <VerifiedBadge v-if="verified" class="text-yellow-400" />
          </h3>
          <div class="flex items-center space-x-0.5">
            <p
              class="text-sm text-gray-400 break-words text-ellipsis overflow-hidden line-clamp-1"
              v-emoji
            >
              {{ realMessage }}
            </p>
          </div>
        </div>
      </div>
      <div class="ml-auto">
        <p class="text-sm text-gray-400 text-left">
          {{ $time.format(new Date(message.date), 'mini-now') }}
        </p>
      </div>
    </div>
  </div>
  <ContactSheet
    :visible="showSheet && contacts.findByID(id) != null"
    @close="showSheet = false"
    :contact="contacts.findByID(id) as Contact"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useAuth2Store } from '@/stores/auth2'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import { onLongPress } from '@vueuse/core'
import ContactSheet from '@/components/Group/ContactSheet.vue'
import { useContactsStore } from '@/stores/contacts'
import type { Contact } from '@/types/contact'
import { getRealUserName } from '@/scripts/getRealUserName'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { isApp } from '@/scripts/mobile/isApp'

const props = defineProps<{
  image?: string
  title: string
  verified: boolean
  id: number
  message: {
    sender_id: number
    sender_name: string
    nick_name: string | null
    content: string | null
    type: string
    date: string
  }
  seen?: boolean
}>()

const i18n = useI18n()
const auth = useAuth2Store()
const contacts = useContactsStore()
const wrap = ref<HTMLElement | null>(null)
const showSheet = ref(false)

onLongPress(wrap, () => {
  if(isApp()) Haptics.impact({ style: ImpactStyle.Light })
  showSheet.value = true
}, { delay: 300 })

const realMessage = computed(() => {
  const isSentByYou = props.message.sender_id == auth.user?.id
  const sender = isSentByYou ? i18n.t('You') : props.message.nick_name ? props.message.nick_name : props.message.sender_name
  let build = sender + ': '

  if (props.message.content != null && props.message.type == 'message')
    return (build + props.message.content).replace('\n', ' ')

  return i18n.t(props.message.type + (isSentByYou ? '.you' : ''), {
    sender: sender,
    groupName: props.title
  })
})

const realTitle = computed(() => {
  return getRealUserName(props.title)
})
</script>
