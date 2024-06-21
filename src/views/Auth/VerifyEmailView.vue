<template>
  <GuestLayout>
    <h1
      v-if="loading"
      class="text-2xl fontTheme text-center flex items-center space-x-3 justify-center"
    >
      <span>{{ $t('Just a moment') }}</span>
      <Spinner />
    </h1>
    <div v-else-if="success">
      <div class="flex items-center justify-center">
        <VerifiedBadge class="text-purple-400 !w-24 !h-24" />
      </div>
      <h1 class="text-center text-lg mt-4 fontTheme">{{ $t('Successful verification') }}</h1>
    </div>
    <div v-else>
      <div class="flex items-center justify-center">
        <Error class="text-red-400 !w-24 !h-24" />
      </div>
      <h1 class="text-center text-lg mt-4 fontTheme">{{ $t('Verification failed') }}</h1>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
import GuestLayout from '@/layouts/GuestLayout.vue'
import Spinner from '@/components/Icons/Spinner.vue'
import { onMounted, ref } from 'vue'
import VerifiedBadge from '@/components/Icons/VerifiedBadge.vue'
import Error from '@/components/Icons/Error.vue'
import request from '@/scripts/request/request'
import { useRoute } from 'vue-router'

const route = useRoute()
const loading = ref(true)
const success = ref(false)

onMounted(async () => {
  const res = await request.get(`/verify-email/${route.params.token}`)
  success.value = res.status == 200
  loading.value = false
})
</script>
