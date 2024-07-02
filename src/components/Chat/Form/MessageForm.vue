<template>
  <section v-if="canSendMessage">
    <HasReply :message="reply" @detach="emit('detachReply')" />
    <div class="flex items-center space-x-2 px-3 py-2 border-t-2 border-t-secondary">
      <Slide :duration=".3">
        <LeftButtons v-if="showIcons || compactView" :canAttachFile="canAttachFile" />
      </Slide>
      <button v-if="!showIcons && !compactView" @click="compactView = true">
        <ArrowRight class="text-gray-400" />
      </button>
      <SendForm @send="send" @showIcons="(s: boolean) => showIcons = s" :compactView="compactView" @click="compactView = false" />
      <EmojiButton @send="send" v-if="showIcons || compactView" />
    </div>
  </section>
  <MessagePermissionDenied v-else />
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import type { ThemeDataBottom } from '@/types/chat'
import MessagePermissionDenied from '@/components/Chat/Form/MessagePermissionDenied.vue'
import HasReply from '@/components/Chat/Form/HasReply.vue'
import SendForm from '@/components/Chat/Form/SendForm.vue'
import { ref } from 'vue'
import LeftButtons from '@/components/Chat/Form/LeftButtons.vue'
import Slide from '@/components/Transitions/Slide.vue'
import EmojiButton from '@/components/Chat/Form/EmojiButton.vue'
import ArrowRight from '@/components/Icons/ArrowRight.vue'

defineProps<{
  reply?: Message | undefined
  canSendMessage: boolean
  theme?: ThemeDataBottom | undefined
  canAttachFile: boolean
}>()

const emit = defineEmits(['send', 'detachReply'])
const showIcons = ref(true)
const compactView = ref(false)

const send = (content: string) => {
  emit('send', content)
}
</script>