<template>
  <section class="mx-4 my-4">
    <h2 class="text-lg font-bold">{{ $t('Developers') }}</h2>
    <a
      :href="devURL"
      target="_blank"
      class="transition-colors w-full bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
    >
      {{ $t('Developer interface') }}
    </a>

    <PushButton
      :is-link="true"
      to-name="dev.logs"
      class="transition-colors w-full bg-secondary-all py-2 rounded-xl mt-3 fontTheme flex items-center space-x-2 justify-center"
    >
      <span>
        {{ $t('Application log') }}
      </span>
      <LogFile/>
    </PushButton>
  </section>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import { computed } from 'vue'
import LogFile from '@/components/Icons/LogFile.vue'

const devURL = computed(() => window.GLOBAL_ENV.DEVS_HOST)
</script>
