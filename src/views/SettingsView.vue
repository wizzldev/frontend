<template>
  <SettingsLayout>
    <section class="mx-2 my-4 text-center">
      <img
        :src="auth.user?.image_url"
        :alt="auth.user?.first_name + '\'s profile image'"
        class="w-12 h-12 rounded-full mx-auto"
      />
      <h2 class="mt-1 fontTheme">{{ auth.user?.first_name }} {{ auth.user?.last_name }}</h2>
    </section>
    <section>
      <h3 class="mx-3 text-gray-700 text-sm font-bold">{{ $t('Your profile') }}</h3>
      <PushButton :is-link="false">

      </PushButton>
    </section>
  </SettingsLayout>
</template>

<script setup lang="ts">
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import { useAuthStore } from '@/stores/auth'
import PushButton from '@/components/Elements/PushButton.vue'

const auth = useAuthStore()
</script>
