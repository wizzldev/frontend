<template>
  <Modal :show="show" :disable-close="true">
    <div>
      <PushButton
        v-if="canSendMessage"
        class="btnList bg-tertiary-all"
        :is-link="false"
        @click="d('reply', msg)"
      >
        {{ $t('Reply') }}
      </PushButton>
      <PushButton
        @click="d('edit', msg)"
        v-if="auth.user?.id == msg.sender.id"
        class="btnList bg-tertiary-all"
        :is-link="false"
      >
        {{ $t('Edit message') }}
      </PushButton>
      <div v-if="(auth.user?.id == msg.sender.id && canDeleteMessage) || canDeleteOtherMessage">
        <PushButton
          v-if="!nextDelete"
          class="btnList bg-red-all"
          :is-link="false"
          @click="nextDelete = true"
        >
          {{ $t('Delete message') }}
        </PushButton>
        <div v-if="nextDelete" class="grid grid-cols-2 gap-2">
          <PushButton
            @click="nextDelete = false"
            :is-link="false"
            class="w-full bg-tertiary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
          >
            {{ $t('Retain') }}
          </PushButton>
          <PushButton
            :is-link="false"
            @click="d('delete', msg)"
            class="w-full bg-red-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
          >
            {{ $t('Delete') }}
          </PushButton>
        </div>
      </div>
      <PushButton
        v-if="auth.user?.id != msg.sender.id"
        class="btnList bg-tertiary-all"
        :is-link="false"
      >
        {{ $t('Report message') }}
      </PushButton>
      <PushButton class="btnList bg-tertiary-all" :is-link="false" @click="emit('close')">
        {{ $t('Close') }}
      </PushButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import type { Message } from '@/types/message'
import { useAuth2Store } from '@/stores/auth2'
import { onMounted, ref } from 'vue'

const auth = useAuth2Store()

defineProps<{
  show: boolean
  msg: Message
  canDeleteMessage: boolean
  canDeleteOtherMessage: boolean
  canSendMessage: boolean
}>()

const emit = defineEmits(['reply', 'delete', 'close', 'edit'])

const nextDelete = ref(false)

const d = (event: 'reply' | 'delete' | 'edit', ...data: Array<any>) => {
  emit(event, ...data)
  emit('close')
}

onMounted(() => (nextDelete.value = false))
</script>

<style scoped>
.btnList {
  @apply w-full block py-2 rounded-xl mt-3 items-center space-x-2 justify-center;
}
</style>
