<template>
  <header class="px-5 py-4 flex items-center justify-between border-b border-secondary">
    <div class="flex items-center space-x-2">
      <img
        class="w-8 h-8 rounded-full"
        src="../../assets/branding/wizzl-pink-small-128.png"
        alt="Wizzl logo"
      />
      <h2
        class="text-lg font-bold fontTheme text-ellipsis text-nowrap overflow-hidden line-clamp-1"
      >
        {{ pageTitle }}
      </h2>
    </div>
    <div class="flex items-center space-x-2">
      <PushButton
        class="bg-secondary text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
        :is-link="false"
      >
        <Support />
      </PushButton>
      <PushButton
        class="bg-secondary text-blue-400 p-1.5 rounded-xl flex items-center justify-center"
        :is-link="false"
      >
        <Book />
      </PushButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Book from '@/components/Icons/Book.vue'
import Support from '@/components/Icons/Support.vue'

defineProps<{
  backTo?: string
}>()

const route = useRoute()
const auth = useAuthStore()

const pageTitle = computed((): string => {
  const data = (route.name as string).split('.')
  const resource = data[data.length-1].replace('-', ' ')
  return resource.charAt(0).toUpperCase() + resource.slice(1)
})
</script>
