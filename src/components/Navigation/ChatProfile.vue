<template>
  <header class="px-5 py-4 flex items-center justify-between border-b border-secondary">
    <div class="flex items-center space-x-2">
      <PushButton :is-link="true" to-name="chat.contacts" class="bg-secondary rounded-full p-2 flex items-center justify-center text-gray-400">
        <BackArrow/>
      </PushButton>
      <img v-if="loading"
           class="w-8 h-8 rounded-full animate-spin"
           src="../../assets/vectors/loading.svg"
           alt="Loading image"
      />
      <img v-else
        class="w-8 h-8 rounded-full"
        :src="image"
        :alt="`${name}'s chat image`"
      />
      <h2 class="text-lg font-bold fontTheme">{{ loading ? $t('Loading') : name }}</h2>
    </div>
    <div class="flex items-center space-x-2">
      <PushButton :disabled="loading" class="bg-secondary text-gray-400 p-1.5 rounded-xl flex items-center justify-center" :is-link="false">
        <Settings />
      </PushButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Settings from '@/components/Icons/Settings.vue'
import BackArrow from '@/components/Icons/BackArrow.vue'

defineProps<{
  image: string;
  name: string;
  loading: boolean;
}>()
</script>