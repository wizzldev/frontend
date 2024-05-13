<template>
  <div class="border-t-2 border-t-secondary px-3 py-2" :class="{ customTheme: theme }">
    <div class="flex items-center space-x-2">
      <form class="w-full" v-on:submit.prevent="$emit('send')">
        <div
          data-theme="input-form"
          class="bg-secondary rounded-3xl w-full flex items-center justify-between"
        >
          <input
            data-theme="input-form"
            type="text"
            class="resize-none bg-secondary rounded-3xl py-2 px-3 pl-5 w-full"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :value="value"
            :placeholder="$t('Message')"
            required
          />
          <button class="py-2 px-3 flex items-center justify-center">
            <Send />
          </button>
        </div>
      </form>
      <button
        @click="$emit('emoji', theme?.emoji || '🌟')"
        class="transition-colors text-lg w-9 h-9 p-2 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20"
      >
        {{ theme?.emoji || '🌟' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Send from '@/components/Icons/Send.vue'
import type { ThemeDataBottom } from '@/types/chat'

defineProps<{
  theme: ThemeDataBottom | undefined
  value: string
}>()
</script>

<style scoped>
.customTheme {
  background: v-bind('theme?.bg') !important;
  color: v-bind('theme?.text') !important;
  border-color: v-bind('theme?.border') !important;
}

.customTheme [data-theme='input-form'],
.customTheme [data-theme='button'] {
  background: v-bind('theme?.input.bg.default') !important;
  color: v-bind('theme?.input.text.default') !important;
}

.customTheme [data-theme='input-form']:hover,
.customTheme [data-theme='button']:hover {
  background: v-bind('theme?.input.bg.hover') !important;
  color: v-bind('theme?.input.text.hover') !important;
}

.customTheme [data-theme='input-form']:focus,
.customTheme [data-theme='button']:focus {
  background: v-bind('theme?.input.bg.focus') !important;
  color: v-bind('theme?.input.text.focus') !important;
}
</style>
