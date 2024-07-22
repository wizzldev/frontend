<template>
  <Modal :show="show" @close="$emit('close')">
    <h2 class="text-2xl fontTheme">{{ $t('IP Verification') }}</h2>
    <p class="text-gray-400 mt-3">
      {{ $t('Whoops! Seems to be logging in from a new device.') }}
      {{ $t('Check your mailbox to authenticate this IP address.') }}
    </p>
    <FormButton title="Okay" :processing="false" @click="$emit('close')" />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modals/Modal.vue'
import FormButton from '@/components/Auth/FormButton.vue'

defineProps<{
  show: boolean
}>()
</script>
