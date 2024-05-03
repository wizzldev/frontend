<template>
  <div class="py-3 transition-colors hover:bg-secondary">
    <div class="flex items-center mx-5">
      <div class="flex items-center">
        <img
          class="rounded-xl w-12 h-12"
          :src="image"
          alt="Chat Image"
        />
        <div class="w-full px-2">
          <h3>{{ title }}</h3>
          <div class="flex items-center space-x-0.5">
            <p class="text-sm text-gray-400 text-ellipsis text-nowrap overflow-hidden line-clamp-1">{{ message }}</p>
            <p class="text-sm text-gray-400">&nbsp;&#x2022;&nbsp;{{ $time.format(new Date(date), 'mini-now') }}</p>
          </div>
        </div>
      </div>
      <div class="ml-auto">
        x
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string;
  title: string;
  message: string;
  date: string;
  seen?: boolean;
}>()
</script>