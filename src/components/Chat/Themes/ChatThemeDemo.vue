<script setup lang="ts">
import type { ThemeData } from '@/types/theme'
import MessageForm from '@/components/Chat/Form/MessageForm.vue'
import { computed } from 'vue'
import ChatThemeMessageList from '@/components/Chat/Themes/ChatThemeMessageList.vue'

const props = defineProps<{
  id: number
  name: string
  theme?: ThemeData
  active: boolean
}>()

const bgImgUrl = computed(() => `url("${props?.theme?.main.bgImage}")`)
</script>

<template>
  <div class="w-full my-3">
    <div
      class="border border-secondary bg-secondary px-4 py-2 flex items-center justify-between rounded-t-lg"
      :class="{ customThemeTop: !!theme }"
    >
      <div
        v-tippy="{ content: $t('Select') }"
        class="w-4 h-4 min-w-4 min-h-4 rounded-lg cursor-pointer"
        :class="{
          'bg-tertiary': !active,
          'bg-violet-400': active,
          customThemeTopIconColor: !active && !!theme
        }"
        @click="$emit('select', id)"
      ></div>
      <p class="fontTheme">{{ $t(`theme.${name}`) }}</p>
    </div>
    <div
      class="h-40 border-x border-secondary overflow-x-hidden overflow-y-scroll relative"
      :class="{ customThemePage: !!theme }"
    >
      <ChatThemeMessageList :theme="theme?.main" />
    </div>
    <MessageForm
      :theme="theme?.bottom"
      :can-send-message="true"
      emoji="🚀"
      :edit="null"
      :can-attach-file="true"
      :demo="true"
    />
    <div
      class="border border-secondary bg-secondary py-1 flex items-center justify-between rounded-b-lg"
      :class="{ customThemeBottomBgOnly: !!theme }"
    ></div>
  </div>
</template>

<style scoped>
.customThemeTop {
  background: v-bind('theme?.top?.bg') !important;
  color: v-bind('theme?.top?.text') !important;
  border-color: v-bind('theme?.top.border') !important;
}

.customThemeTopIconColor {
  background: v-bind('theme?.top?.button.bg.default') !important;
}

.customThemeBottomBgOnly {
  background: v-bind('theme?.bottom?.bg') !important;
  border-color: v-bind('theme?.bottom?.border') !important;
}

.customThemePage {
  background-image: v-bind('bgImgUrl') !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-attachment: fixed !important;
  overflow: hidden !important;
  border-color: v-bind('theme?.top.border');
}

@media (min-width: 768px) {
  .customThemePage {
    background-size: contain !important;
  }
}
</style>
