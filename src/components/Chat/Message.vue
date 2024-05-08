<template>
  <div v-if="message.type.startsWith('message')" class="w-3/4 my-1 mx-3" :class="{'ml-auto': sentByAuthUser, 'flex items-end space-x-2': !sentByAuthUser}">
    <div v-if="!sentByAuthUser">
      <img
        class="w-5 h-5 rounded-full"
        :src="message.sender.image_url"
        :alt="message.sender.first_name"
      />
    </div>
    <div class="border border-secondary px-4 py-1 max-w-full rounded-lg" :class="{'bg-secondary': !sentByAuthUser}">
      {{ message.content }}
    </div>
  </div>
  <div v-else class="my-2 mx-3 text-center">
    <p class="text-gray-600 text-sm">{{ infoMessage() }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@/types/message'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const auth = useAuthStore()
const i18n = useI18n()

const props = defineProps<{
  message: Message;
}>()

const sentByAuthUser = computed(() => props.message.sender.id == auth?.user?.id)

const infoMessage = () => {
  return i18n.t(props.message.type, {sender: props.message.sender.first_name})
}
</script>