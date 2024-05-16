<template>
  <ChatLayout :chat-profile="chatProfile" :connection="{ connected: true, error: false }" :theme="undefined">
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