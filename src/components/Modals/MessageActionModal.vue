<template>
  <Modal :show="show">
    <h2 class="text-2xl fontTheme">{{ $t('Actions') }}</h2>
    <div class="mt-2">
      <PushButton class="btnList" :is-link="false" @click="d('reply', msg)">
        {{ $t('Reply') }}
      </PushButton>
      <PushButton v-if="auth.user?.id == msg.sender.id" class="btnList" :is-link="false">
        {{ $t('Edit message') }}
      </PushButton>
      <PushButton v-if="auth.user?.id == msg.sender.id" class="btnList" :is-link="false" @click="d('delete', msg)">
        {{ $t('Delete message') }}
      </PushButton>
      <PushButton v-if="auth.user?.id != msg.sender.id" class="btnList" :is-link="false">
        {{ $t('Report message') }}
      </PushButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import type { Message } from '@/types/message'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

defineProps<{
  show: boolean
  msg: Message
}>()

const emit = defineEmits(['reply', 'delete', 'close'])

const d = (event: 'reply' | 'delete', ...data: Array<any>) => {
  emit(event, ...data)
  emit('close')
}
</script>

<style scoped>
.btnList {
  @apply mt-2 w-full px-3 py-1.5 rounded-lg bg-tertiary hover:bg-tertiary-hover focus:bg-tertiary-hover;
}
</style>
