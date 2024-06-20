<template>
  <Modal :show="show">
    <h2 class="text-2xl fontTheme">{{$t('Actions')}}</h2>
    <div class="mt-2">
      <PushButton class="btnList" :is-link="false" @click="$emit('reply', msg)">
        {{ $t('Reply') }}
      </PushButton>
      <PushButton class="btnList" :is-link="false">
        {{ $t('Edit message') }}
      </PushButton>
      <PushButton class="btnList" :is-link="false">
        {{ $t('Delete message') }}
      </PushButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Modal from '@/components/Modals/Modal.vue'
import type { Message } from '@/types/message'

defineProps<{
  show: boolean
  msg: Message
}>()
</script>

<style scoped>
.btnList {
  @apply mt-2 w-full px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary-hover focus:bg-secondary-hover;
}
</style>