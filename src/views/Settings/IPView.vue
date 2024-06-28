<template>
  <SettingsLayout>
    <section class="mx-4 mt-5">
      <h2 class="text-xl fontTheme font-bold">{{ $t('IP addresses') }}</h2>
      <div class="my-12 flex items-center justify-center" v-if="loading">
        <Spinner />
      </div>
      <div class="mt-5" v-else>
        <ul>
          <li
            class="bg-secondary first:rounded-t-lg last:rounded-b-lg px-2 py-3 flex items-center border-b border-tertiary last:border-b-0"
            v-for="ip in ips"
            :key="ip.id"
          >
            <div class="ml-5">
              <h2 class="text-gray-200 text-sm font-bold">{{ ip.ip }}</h2>
            </div>
            <div
              @click="remove(ip)"
              class="w-8 h-8 rounded-full bg-tertiary-all text-gray-400 hover:text-white focus:text-white cursor-pointer flex items-center justify-center ml-auto"
            >
              <Times v-if="!processingIDs.includes(ip.id)" class="!w-4 !h-4" />
              <Spinner v-else class="!w-4 !h-4" />
            </div>
          </li>
        </ul>
      </div>
    </section>
  </SettingsLayout>
</template>

<script setup lang="ts">
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import Spinner from '@/components/Icons/Spinner.vue'
import { onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRouter } from 'vue-router'
import Times from '@/components/Icons/Times.vue'

interface IP {
  id: number
  ip: string
}

const router = useRouter()

const loading = ref(true)
const ips = ref<Array<IP>>([])
const processingIDs = ref<Array<number>>([])

const fetch = async () => {
  loading.value = true
  const res = await request.get('/security/ips')
  if (res.data.$error) {
    await router.push({ name: 'settings.default' })
    return
  }
  ips.value = res.data as Array<IP>
  loading.value = false
}

const remove = async (s: IP) => {
  const inx = ips.value.indexOf(s)
  processingIDs.value.push(s.id)
  await request.delete(`/security/ips/${s.id}`)
  processingIDs.value.splice(processingIDs.value.indexOf(s.id), 1)
  ips.value.splice(inx, 1)
}

onMounted(fetch)
</script>
