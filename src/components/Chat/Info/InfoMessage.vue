<template>
  <p class="text-center text-xs text-gray-400" :class="{ customText: theme }">
    {{ info }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuth2Store } from '@/stores/auth2'
import { computed } from 'vue'
import type { Message } from '@/types/message'
import type { ThemeDataMain } from '@/types/theme'

const props = defineProps<{
  message: Message
  theme: ThemeDataMain | undefined
}>()

const i18n = useI18n()
const auth = useAuth2Store()

const info = computed(() =>
  i18n.t(props.message.type + (props.message.sender.id == auth?.user?.id ? '.you' : ''), {
    sender: props.message.sender.first_name
  })
)
</script>

<style scoped>
.customText {
  color: v-bind('theme?.text') !important;
}
</style>
