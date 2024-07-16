<template>
  <div class="bg-purple-600 py-3 px-3 text-center cursor-pointer rounded-2xl" @click="notImplemented">
    <h2>
      <span v-emoji class="me-1">🚀</span>
      Upgrade to
      <span class="fontWizzl">Wizzl</span>
      <span class="pro fontTheme ms-1">PRO</span>
      or
      <span class="pro fontTheme">
        PRO<span class="plus">+</span>
      </span>
    </h2>
  </div>
</template>

<style>
.pro {
  @apply px-2 py-0.5 bg-[#b26cf3] rounded-lg text-sm text-black;
}

.pro .plus {
  @apply text-yellow-400 font-bold;
}
</style>

<script setup lang="ts">
import { useToast } from 'vue-toastification'

const toast = useToast()

const notImplemented = () => {
  toast.warning('Not implemented.')
}
</script>

