<template>
  <Modal :show="true" :disable-close="true">
    <h2 class="text-2xl fontTheme">{{ $t('Terms and conditions') }}</h2>
    <div class="mt-2 text-left">
      <p class="text-gray-400">
        {{ $t('Accept our terms and conditions before using our product.') }}
      </p>
      <p class="mt-2">
        {{ $t('Direct links') }}:<br />
        <router-link class="text-blue-400" to="/terms">{{ $t('Terms and conditions') }}</router-link
        ><br />
        <router-link class="text-blue-400" to="/privacy">{{ $t('Privacy Policy') }}</router-link>
      </p>
      <PushButton
        :is-link="false"
        class="transition-colors w-full bg-purple-500 hover:bg-purple-400 focus:bg-purple-400 py-2.5 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
        @click="$emit('accept')"
        >{{ $t('I understand and I accept') }}</PushButton
      >
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modals/Modal.vue'
import PushButton from '@/components/Elements/PushButton.vue'
</script>
