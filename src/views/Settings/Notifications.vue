<template>
  <div class="mx-4 mb-2">
    <FormButtonSecondary
      v-if="isApp() && show"
      @submit="requestPermission"
      class="!py-2"
      title="Enable push notifications"
      :processing="false"
    />
  </div>
</template>
<script setup lang="ts">
import FormButtonSecondary from '@/components/Auth/FormButtonSecondary.vue'
import { isApp } from '@/scripts/mobile/isApp'
import { onMounted, ref } from 'vue'
import { addListeners, isNotificationsAllowed } from '@/scripts/mobile/notification'
import request from '@/scripts/request/request'
import { useRouter } from 'vue-router'

const show = ref(true)
const router = useRouter()

const requestPermission = async () => {
  if(!isApp()) return
  await addListeners(request, router)
  show.value = !(await isNotificationsAllowed())
}

onMounted(async () => {
  if(!isApp()) return
  show.value = !(await isNotificationsAllowed())
})
</script>