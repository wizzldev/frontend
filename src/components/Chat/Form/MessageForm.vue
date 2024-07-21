<template>
  <section
    v-if="canSendMessage"
    :class="{ 'border-b-4 border-b-secondary': showToolbar, 'theme-border': theme }"
  >
    <HasReply :message="reply" @detach="emit('detachReply')" />
    <HasMessageEdit :message="edit" @detach="emit('detachEdit')" />
    <div
      class="bg-main flex items-center space-x-2 px-3 py-2 border-t-2 border-t-secondary"
      :class="{ 'theme-bg theme-border': theme }"
    >
      <Slide :duration="0.3">
        <LeftButtons
          v-if="showIcons || compactView"
          :theme="theme"
          :canAttachFile="canAttachFile"
          @tools="showToolbar = !showToolbar"
        />
      </Slide>
      <Fade>
        <button class="delay-300" v-if="!showIcons && !compactView" @click="compactView = true">
          <ArrowRight class="text-gray-400" />
        </button>
      </Fade>
      <SendForm
        :defaultValue="edit ? edit.content : ''"
        :compactView="compactView"
        :theme="theme"
        @send="send"
        @showIcons="(s: boolean) => (showIcons = s)"
        @click="compactView = false"
      />
      <EmojiButton :emoji="theme?.emoji" @send="send" v-if="showIcons || compactView" />
    </div>
  </section>
  <MessagePermissionDenied :theme="theme" v-else />
  <SlideFromBottom>
    <ToolBar v-if="showToolbar" @close="showToolbar = false" />
  </SlideFromBottom>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import type { ThemeDataBottom } from '@/types/chat'
import MessagePermissionDenied from '@/components/Chat/Form/MessagePermissionDenied.vue'
import HasReply from '@/components/Chat/Form/HasReply.vue'
import SendForm from '@/components/Chat/Form/SendForm.vue'
import { onMounted, ref, watch } from 'vue'
import LeftButtons from '@/components/Chat/Form/LeftButtons.vue'
import Slide from '@/components/Transitions/Slide.vue'
import EmojiButton from '@/components/Chat/Form/EmojiButton.vue'
import ArrowRight from '@/components/Icons/ArrowRight.vue'
import ToolBar from '@/components/Chat/Form/ToolBar.vue'
import SlideFromBottom from '@/components/Transitions/SlideFromBottom.vue'
import Fade from '@/components/Transitions/Fade.vue'
import HasMessageEdit from '@/components/Chat/Form/HasMessageEdit.vue'
import { setBottomTheme } from '@/scripts/mobile/theme'

const props = defineProps<{
  reply?: Message | undefined
  canSendMessage: boolean
  theme?: ThemeDataBottom | undefined
  canAttachFile: boolean
  edit: Message | null
}>()

const emit = defineEmits(['send', 'detachReply', 'detachEdit'])
const showIcons = ref(true)
const compactView = ref(false)
const showToolbar = ref(false)

const send = (content: string) => {
  emit('send', content)
}

watch(showIcons, (s) => {
  if (!s) showToolbar.value = false
})

onMounted(async () => {
  if(props.canSendMessage) return
  await setBottomTheme('#1d1d27')
})
</script>

<style scoped>
.theme-bg {
  background: v-bind('theme?.bg') !important;
}

.theme-border {
  border-color: v-bind('theme?.border') !important;
}
</style>
