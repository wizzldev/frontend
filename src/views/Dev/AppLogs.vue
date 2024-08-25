<template>
  <AppLayout>
    <input
      class="px-5 py-2 w-full bg-secondary"
      placeholder="Filter by regex"
      v-model="search"
    />
    <main class="px-3 py-2 fontCode">
      <template v-for="l in logs()" :key="l.date.toString()">
        <div class="my-4" v-if="match(l)">
          <p class="text-xs text-gray-400 mb-1">{{ l.date.toLocaleDateString() }} {{ l.date.toLocaleTimeString() }}</p>
          <p class="max-w-full break-words">
            <span class="text-blue-500 font-bold">[{{ l.resource }}]:</span>
            {{ l.message }}
          </p>
        </div>
      </template>
    </main>
  </AppLayout>
</template>

<script setup lang="ts">
import { useLogger } from '@/stores/logger'
import AppLayout from '@/layouts/AppLayout.vue'
import { ref } from 'vue'

const { get: logs } = useLogger()

const search = ref('')

const match = ({resource, message}: { resource: string, message: string }): boolean => {
  const s = `${resource} ${message}`
  const r = new RegExp(search.value)
  return r.test(s)
}
</script>