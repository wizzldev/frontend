<template>
  <section class="mx-4 my-4">
    <h2 class="text-lg font-bold">{{ $t('Developers') }}</h2>
    <PushButton
      :is-link="true"
      to-name="settings.sessions"
      class="transition-colors w-full bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
    >
      {{ $t('BOTs') }}
    </PushButton>
  </section>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
</script>
