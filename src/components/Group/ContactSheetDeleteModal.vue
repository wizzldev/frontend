<template>
  <Modal :show="true" @close="$emit('close')">
    <h2 class="text-2xl fontTheme">{{ $t('Are you sure?') }}</h2>
    <p class="text-left mt-2">
      {{
        $t('All messages, files will be lost and you may lose your community.')
      }}
    </p>
    <div class="grid grid-cols-2 gap-2">
      <PushButton
        @click="$emit('close')"
        :is-link="false"
        class="w-full bg-tertiary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
      >
        {{ $t('Retain') }}
      </PushButton>
      <PushButton
        :is-link="false"
        @click="$emit('delete')"
        class="w-full bg-red-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
      >
        {{ $t('Delete') }}
      </PushButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modals/Modal.vue'
import PushButton from '@/components/Elements/PushButton.vue'
</script>