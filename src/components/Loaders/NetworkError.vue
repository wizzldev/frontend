<template>
  <div class="text-center mx-5">
    <Error class="w-10 h-10 text-red-500 mx-auto mb-3 animate-pulse" />
    <h1 class="text-xl mb-2 fontTheme">{{ $t('Network error') }}</h1>
    <p class="text-gray-400 text-sm">Restart the application when connected to internet.</p>
    <p>or</p>
    <p class="text-gray-400 text-sm">
      Select an other API gateway and also restart the application
    </p>
    <select
      class="mt-3 text-lg w-full text-center p-2 px-5 flex items-center justify-center rounded-xl bg-secondary-all"
    >
      <option>api.wizzl.app</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import Error from '@/components/Icons/Error.vue'
</script>
