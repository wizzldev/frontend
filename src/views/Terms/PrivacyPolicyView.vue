<template>
  <AppLayout>
    <GuestNav />
    <main class="h-full w-full max-w-full overflow-y-scroll py-4 px-4">
      <TermsNav />
      <TermsList :list="privacy" />
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import GuestNav from '@/components/Navigation/GuestNav.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import TermsNav from '@/components/Navigation/TermsNav.vue'
import TermsList from '@/components/TermsList.vue'
import privacy from '@/assets/service/privacy.json'
</script>
