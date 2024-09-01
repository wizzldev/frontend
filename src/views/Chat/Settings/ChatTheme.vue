<template>
  <ChatSettingsLayout
    :chat-profile="chatProfile"
    :connection="{ connected: true, error: false }"
    :theme="undefined"
    :isYou="false"
    to-name="chat.message"
    :to-params="{ id: $route.params.id }"
  >
    <h1 class="text-center p-3 fontTheme" v-if="!loaded">{{ $t('Loading') }} <Spinner /></h1>
    <div class="px-2 py-3" v-else>
      <PushButtonSecondary @click="removeTheme">
        {{ $t('Use default') }}
      </PushButtonSecondary>
      <ChatThemeDemo
        v-for="(theme, id) in themes"
        :key="id"
        :name="theme.name"
        :theme="theme.data"
        :id="id"
        :active="id == selectedThemeID"
        @select="selectTheme"
      />
    </div>
  </ChatSettingsLayout>
</template>

<script setup lang="ts">
import ChatSettingsLayout from '@/layouts/ChatSettingsLayout.vue'
import { fetchInfo, getChatProfileRef } from '@/views/Chat/Settings/fetchInfo'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Spinner from '@/components/Icons/Spinner.vue'
import request from '@/scripts/request/request'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import type { ThemeData } from '@/types/theme'
import ChatThemeDemo from '@/components/Chat/Themes/ChatThemeDemo.vue'
import PushButtonSecondary from '@/components/Elements/PushButtonSecondary.vue'

const route = useRoute()
const { t } = useI18n()
const { error, success } = useToast()
const loaded = ref(false)
const chatProfile = getChatProfileRef()
const yourRoles = ref<Array<string>>([])
const nextCursor = ref('')
const themes = ref<Record<number, { name: string; data: ThemeData }>>({})
const selectedThemeID = ref<number>(0)

const fetchProfile = async () => {
  const { user, your_roles, theme_id } = await fetchInfo(route.params.id as string)
  selectedThemeID.value = theme_id || 0
  if (!user) return
  chatProfile.value = user
  if (!your_roles) return
  yourRoles.value = your_roles
}

const fetchThemes = async () => {
  const res = await request.get(`/themes?cursor=${nextCursor.value}`)
  if (res.data.$error || res.data.$network) {
    error(t('Failed to fetch themes'))
    return
  }
  const data = res.data as {
    next_cursor: string
    data: Array<{ id: number; name: string; data: string }>
  }
  data.data.forEach((t) => {
    themes.value[t.id] = {
      data: JSON.parse(t.data) as ThemeData,
      name: t.name
    }
  })
  loaded.value = true
}

const selectTheme = async (id: number) => {
  selectedThemeID.value = id
  chatProfile.value.loading = true
  const res = await request.put(`/chat/${route.params.id as string}/theme/${id.toString()}`)
  if (!res.data.$error) success(t('Successfully updated'))
  else error(t('Something went wrong'))
  chatProfile.value.loading = false
}

const removeTheme = async () => {
  chatProfile.value.loading = true
  selectedThemeID.value = 0
  const res = await request.delete(`/chat/${route.params.id as string}/theme`)
  if (!res.data.$error) success(t('Successfully updated'))
  else error(t('Something went wrong'))
  chatProfile.value.loading = false
}

onMounted(async () => {
  await fetchProfile()
  await fetchThemes()
})
</script>
