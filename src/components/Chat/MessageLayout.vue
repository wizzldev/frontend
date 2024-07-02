<template>
  <ul
    ref="scrollContainer"
    class="py-2 h-full w-full max-w-full flex space-y-1 overflow-y-scroll flex-col-reverse text-white"
    :class="{ customTheme: theme }"
  >
    <li class="w-full" v-for="(msg, inx) in messageList" :key="inx">
      <MessageGroup
        @reply="(msg) => $emit('reply', msg)"
        @modal="(msg) => $emit('modal', msg)"
        :theme="theme"
        @like="(id: number) => $emit('like', id)"
        :messages="msg"
        :isPM="isPM"
        @showImage="showImage"
      />
    </li>
    <li class="w-full text-center text-xl my-3" v-if="loading">
      <Spinner class="text-gray-400" :class="{ customText: theme }" />
    </li>
    <li class="w-full text-center my-3" v-if="!hasNext">
      <p class="text-center text-gray-400 fontTheme" :class="{ customText: theme }">
        {{ $t('No more messages') }}
      </p>
    </li>
  </ul>
  <div class="fixed top-0 left-0" v-if="previewImage != ''">
    <img :src="previewImage" alt="Preview image" />
  </div>
</template>

<script setup lang="ts">
import type { Messages } from '@/types/message'
import type { ThemeDataMain } from '@/types/chat'
import MessageGroup from '@/components/Chat/MessageGroup.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { messageSorter } from '@/components/Chat/messageSorter'
import { useAuthStore } from '@/stores/auth'
import Spinner from '@/components/Icons/Spinner.vue'
import { sleep } from '@/scripts/sleep'

const props = defineProps<{
  messages: Messages
  theme: ThemeDataMain | undefined
  hasNext: boolean
  isPM: boolean
}>()

const emit = defineEmits(['load', 'modal', 'like', 'reply'])

const auth = useAuthStore()
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
  background-image: v-bind('theme?.bgImage');
  background-position: center;
  background-size: contain;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.customText {
  color: v-bind('theme?.text') !important;
}

@media only screen and (max-width: 600px) {
  .customTheme {
    background-size: cover;
  }
}
</style>
