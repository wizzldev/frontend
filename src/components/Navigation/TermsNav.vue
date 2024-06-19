<template>
  <section class="grid grid-cols-2 gap-2 text-center">
    <PushButton
      :is-link="true"
      to-name="service.terms"
      class="w-full px-2 py-1 rounded-xl"
      :class="{ 'bg-tertiary': route.name == 'service.terms', 'bg-secondary-all': route.name != 'service.terms' }"
    >
      {{ $t('Terms') }}
    </PushButton>
    <PushButton
      :is-link="true"
      to-name="service.privacy"
      class="w-full px-2 py-1 rounded-xl"
      :class="{ 'bg-tertiary': route.name == 'service.privacy', 'bg-secondary-all': route.name != 'service.privacy' }"
    >
      {{ $t('Privacy') }}
    </PushButton>
  </section>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
