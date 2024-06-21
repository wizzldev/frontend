<template>
  <section class="grid grid-cols-2 gap-2 mx-5 text-center py-3">
    <PushButton
      :is-link="true"
      to-name="chat.contacts"
      class="w-full px-2 py-1 rounded-xl"
      :class="{
        'bg-tertiary': route.name == 'chat.contacts',
        'bg-secondary-all': route.name != 'chat.contacts'
      }"
    >
      {{ $t('Messages') }}
    </PushButton>
    <PushButton
      :is-link="true"
      to-name="chat.new"
      class="w-full px-2 py-1 rounded-xl"
      :class="{
        'bg-tertiary': route.name == 'chat.new',
        'bg-secondary-all': route.name != 'chat.new'
      }"
    >
      {{ $t('New') }}
    </PushButton>
  </section>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
