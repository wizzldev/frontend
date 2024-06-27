<template>
  <SettingsLayout>
    <section class="mx-4 mt-5">
      <h2 class="text-xl fontTheme font-bold">{{ $t('Sessions') }}</h2>
      <div class="my-12 flex items-center justify-center" v-if="loading">
        <Spinner />
      </div>
      <div class="my-5" v-else>
        <div class="bg-secondary rounded px-4 py-3 my-2" v-for="session in sessions" :key="session.id">
          {{ session }}
        </div>
      </div>
    </section>
    <BuildInfo v-if="!loading" />
  </SettingsLayout>
</template>

<script setup lang="ts">
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import BuildInfo from '@/components/Settings/BuildInfo.vue'
import Spinner from '@/components/Icons/Spinner.vue'
import { onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRouter } from 'vue-router'
import { UAParser } from 'ua-parser-js'

interface Session {
  id: number
  browser: string
  os: string
  device: string
  cpu: string
  type: "desktop" | "tablet" | "mobile"
}

interface RawSession {
  id: number
  ip: string
  user_agent: string
  current: boolean
}

const router = useRouter()

const loading = ref(true)
const sessions = ref<Array<Session>>([])

const fetch = async () => {
  loading.value = true
  const res = await request.get('/security/sessions')
  if(res.data.$error) {
    await router.push({name: 'settings.default'})
    return
  }
  const raw = res.data as Array<RawSession>

  raw.forEach(s => {
    const parser = new UAParser(s.user_agent)
    const data = parser.getResult()
    sessions.value.push({
      id: s.id,
      browser: data.browser.name || 'unknown',
      cpu: data.cpu.architecture || 'unknown',
      device: data.device.type || 'unknown',
      os: data.os.name || 'unknown',
      type: getType(s.user_agent)
    })
  })

  loading.value = false
}

const getType = (u: string): "mobile" | "tablet" | "desktop" => {
  const isMobile = Boolean(u.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)?.length)
  if(isMobile) return "mobile"
  const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(u);
  if(isTablet) return "tablet"
  return "desktop"
}

onMounted(fetch)
</script>