<template>
  <AppLayout>
    <main class="px-3 py-2 fontCode">
      <div class="my-4" v-for="l in logs()" :key="l.date.toString()">
        <p class="text-xs text-gray-400 mb-1">{{ l?.date.toLocaleDateString() }} {{ l?.date.toLocaleTimeString() }}</p>
        <p class="max-w-full break-words">
          <span class="text-blue-500 font-bold">[{{ l?.resource }}]:</span>
          {{ l?.message }}
        </p>
      </div>
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import { useLogger } from '@/stores/logger'
import AppLayout from '@/layouts/AppLayout.vue'

const { get: logs } = useLogger()
</script>