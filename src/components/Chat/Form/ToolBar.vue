<template>
  <section class="bg-main w-full">
    <div class="h-64 max-h-64 overflow-y-scroll px-3 py-2">
      <div class="my-2">
        <p class="text-xs text-gray-400">{{ $t('General') }}</p>
        <FormButtonSecondary class="!mt-1" title="Upload a GIF" :processing="false" />
        <FormButtonSecondary class="!mt-2" title="Send a customized message" :processing="false" />
        <FormButtonSecondary class="!mt-2" title="Create a poll" :processing="false" />
      </div>
      <div class="my-2">
        <p class="text-xs text-gray-400">{{ $t('Developers') }}</p>
        <FormButtonSecondary class="!mt-1" title="Create an integration" :processing="false" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FormButtonSecondary from '@/components/Auth/FormButtonSecondary.vue'
</script>
