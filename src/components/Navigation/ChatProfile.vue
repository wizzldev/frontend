<template>
  <header :class="{ customTheme: theme }">
    <div class="flex items-center justify-between px-5 py-4 border-b border-secondary">
      <div class="flex items-center space-x-2">
        <PushButton
          :is-link="true"
          to-name="chat.contacts"
          class="bg-secondary-all rounded-full p-2 flex items-center justify-center text-gray-400"
        >
          <BackArrow />
        </PushButton>
        <img
          v-if="loading"
          class="w-8 h-8 rounded-full animate-spin"
          src="../../assets/vectors/loading.svg"
          alt="Loading image"
        />
        <LazyImage
          v-else
          class="w-8 h-8 rounded-full"
          :src="cdnImage(image, 128)"
          :alt="`${name}'s chat image`"
        />
        <h3 class="max-w-full mr-3 flex items-center space-x-1 fontTheme">
          <span class="text-ellipsis text-nowrap overflow-hidden line-clamp-1 text-lg" v-emoji>
            {{ loading ? $t('Loading') : realTitle }}
          </span>
          <VerifiedBadge class="text-yellow-400" v-if="verified" />
        </h3>
      </div>
      <div class="flex items-center space-x-2">
        <PushButton
          v-if="!isYou"
          :disabled="loading"
          class="bg-secondary-all text-gray-400 p-1.5 rounded-xl flex items-center justify-center"
          :is-link="true"
          to-name="chat.settings"
          :to-params="{ id: $route.params.id } as RouteParamsRaw"
        >
          <Settings />
        </PushButton>
      </div>
    </div>

    <div
      v-if="!connected"
      class="bg-purple-400 px-2 py-0.5 flex items-center justify-center space-x-1"
    >
      <Cloud class="!w-3 !h-3" />
      <p class="text-xs">
        {{ $t('Failed to connect to our real-time servers') }}
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
import PushButton from '@/components/Elements/PushButton.vue'
import Settings from '@/components/Icons/Settings.vue'
import BackArrow from '@/components/Icons/BackArrow.vue'
import type { ThemeDataTop } from '@/types/chat'
import type { RouteParamsRaw } from 'vue-router'
import LazyImage from '@/components/Loaders/LazyImage.vue'
import { cdnImage } from '@/scripts/image'
import { computed, ref, watch } from 'vue'
import Cloud from '@/components/Icons/Cloud.vue'
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const connected = ref(window.WS.connected)

watch(window.WS, (w) => {
  connected.value = w.connected
})

const props = defineProps<{
  image: string
  name: string
  loading: boolean
  theme: ThemeDataTop | undefined
  isYou: boolean
  verified: boolean
}>()

const realTitle = computed(() => {
  if (props.name.endsWith('#allowTranslation')) {
    return i18n.t(props.name.substring(0, props.name.length - '#allowTranslation'.length))
  }
  return props.name
})
</script>

<style scoped>
.customTheme {
  background: v-bind('theme?.bg') !important;
  color: v-bind('theme?.text') !important;
}

.customTheme div {
  border-color: v-bind('theme?.border') !important;
}

.customTheme button,
.customTheme a {
  background: v-bind('theme?.button.bg.default') !important;
  color: v-bind('theme?.button.text.default') !important;
}

.customTheme button:hover,
.customTheme a:hover {
  background: v-bind('theme?.button.bg.hover') !important;
  color: v-bind('theme?.button.text.hover') !important;
}

.customTheme button:focus,
.customTheme a:focus {
  background: v-bind('theme?.button.bg.focus') !important;
  color: v-bind('theme?.button.text.focus') !important;
}
</style>
