<template>
  <div class="py-3 transition-colors hover:bg-secondary text-left">
    <div class="flex items-center mx-5">
      <div class="flex items-center">
        <img
          class="rounded-xl w-12 h-12"
          :src="image"
          alt="Chat Image"
        />
        <div class="w-full px-2">
          <h3>{{ title }}</h3>
          <div class="flex items-center space-x-0.5">
            <p class="text-sm text-gray-400 text-ellipsis text-nowrap overflow-hidden line-clamp-1">{{ realMessage }}</p>
            <p class="text-sm text-gray-400">&nbsp;&#x2022;&nbsp;{{ $time.format(new Date(message.date), 'mini-now') }}</p>
          </div>
        </div>
      </div>
      <div class="ml-auto w-6 flex items-center justify-between">
        <img :src="image" alt="seen" class="w-3 h-3 rounded-full">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const i18n = useI18n()
const auth = useAuthStore()

const props = defineProps<{
  image: string;
  title: string;
  message: { sender_id: number, sender_name: string; content: string|null; type: string; date: string };
  seen?: boolean;
}>()

const realMessage = computed(() => {
  if(props.message.content != null && props.message.type == "message") {
    return ((props.message.sender_id == auth.user?.id) ? i18n.t('You') : props.message.sender_name) + ": " + props.message.content
  }
  return i18n.t(props.message.type, {sender: props.message.sender_name, groupName: props.title})
})
</script>