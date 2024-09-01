<template>
  <div class="w-full h-full overflow-hidden relative">
    <img
      v-if="theme && theme.bgImage"
      class="customTheme-bg"
      :src="theme?.bgImage"
      alt="Background image"
    />
    <ul
      ref="scrollContainer"
      class="py-2 h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse text-white z-99"
      :class="{ customTheme: theme }"
      :data-theme-pattern="theme?.is_pattern ? 'true' : 'false'"
    >
      <li class="w-full z-10" v-for="(msg, inx) in messageList" :key="inx">
        <MessageGroup
          @reply="(msg) => $emit('reply', msg)"
          @modal="(msg) => $emit('modal', msg)"
          :theme="theme"
          @like="(id: number) => $emit('like', id)"
          :messages="msg"
          :isPM="isPM"
          @showImage="showImage"
          :canSendMessage="canSendMessage"
        />
      </li>
      <li class="w-full text-center text-xl my-3" v-if="loading">
        <Spinner class="text-gray-400" :class="{ customText: theme }" />
      </li>
      <li class="w-full text-center my-3 z-10" v-if="!hasNext">
        <p class="text-center text-gray-400 fontTheme" :class="{ customText: theme }">
          {{ $t('No more messages') }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Messages } from '@/types/message'
import type { ThemeDataMain } from '@/types/theme'
import MessageGroup from '@/components/Chat/MessageGroup.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { messageSorter } from '@/components/Chat/messageSorter'
import { useAuth2Store } from '@/stores/auth2'
import Spinner from '@/components/Icons/Spinner.vue'
import { sleep } from '@/scripts/sleep'

const props = defineProps<{
  messages: Messages
  theme: ThemeDataMain | undefined
  hasNext: boolean
  isPM: boolean
  canSendMessage: boolean
}>()

const emit = defineEmits(['load', 'modal', 'like', 'reply'])

const auth = useAuth2Store()
const loading = ref(false)
const scrollContainer = ref()

const previewImage = ref('')

const messageList = computed(() => messageSorter(props.messages, auth.user?.id || -1))

const handleScroll = async () => {
  if (loading.value == false && props.hasNext) {
    const el = scrollContainer.value
    if (el.getBoundingClientRect().bottom < window.innerHeight) {
      loading.value = true
      emit('load')
      await sleep(1000)
      loading.value = false
    }
  }
}

const showImage = (src: string) => {
  previewImage.value = src
}

onMounted(() => {
  scrollContainer.value.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  scrollContainer.value.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.customTheme {
  background-color: v-bind('theme?.bg') !important;
  color: v-bind('theme?.text') !important;
}

.customText {
  color: v-bind('theme?.text') !important;
}

.customTheme-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  object-fit: cover;
}
</style>
