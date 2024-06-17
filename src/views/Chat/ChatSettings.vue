<template>
  <ChatLayout :chat-profile="chatProfile" :connection="{ connected: true, error: false }" :theme="undefined">
    <header class="px-4 my-4">
      <img :alt="chatProfile.name" :src="chatProfile.image" class="w-14 h-14 rounded-lg mx-auto" />
      <h2 class="text-center fontTheme">{{ chatProfile.name }}</h2>
    </header>
    <main class="px-4 my-2 text-gray-500">
      <h4 class="text-sm font-bold">{{ $t('Customize') }}</h4>
      <div>

      </div>
    </main>
  </ChatLayout>
</template>

<script setup lang="ts">
import ChatLayout from '@/layouts/ChatLayout.vue'
import { onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRoute } from 'vue-router'

const route = useRoute()
const chatProfile =  ref({name: '', image: '', loading: true})

const fetchProfile = async () => {
  const res = await request.get(`/chat/user/${route.params.id as string}`)
  if(!res?.data?.$error) {
    const user = (res.data as {name: string; image_url: string; is_private_message: boolean})
    chatProfile.value = {
      name: user.name,
      image: user.image_url,
      loading: false,
    }
  }
}

onMounted(fetchProfile)
</script>