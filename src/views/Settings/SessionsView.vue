<template>
  <SettingsLayout>
    <section class="mx-4 mt-5">
      <h2 class="text-xl fontTheme font-bold">{{ $t('Sessions') }}</h2>
      <div class="my-12 flex items-center justify-center" v-if="loading">
        <Spinner />
      </div>
      <div class="mt-5" v-else>
        <ul>
          <li class="bg-secondary first:rounded-t-lg last:rounded-b-lg px-2 py-3 flex items-center border-b border-tertiary last:border-b-0" v-for="session in sessions" :key="session.id">
            <div @click="sessionDetails = session" class="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center cursor-pointer">
              <Phone class="!w-4 !h-4" v-if="session.type == 'mobile'" />
              <Tablet class="!w-4 !h-4" v-else-if="session.type == 'tablet'" />
              <Desktop class="!w-4 !h-4" v-else />
            </div>
            <div class="ml-5">
              <h2 class="text-gray-200 text-sm font-bold">{{ session.os }} &#x2022; {{ session.browser }}</h2>
              <p class="text-sm text-gray-400">
                {{ session.ip }}<template v-if="session.current">&nbsp;&#x2022; <span class="text-green-400">{{ $t('current') }}</span></template>
              </p>
            </div>
            <button :disabled="deletingAll" @click="remove(session)" class="w-8 h-8 rounded-full bg-tertiary-all text-gray-400 hover:text-white focus:text-white cursor-pointer flex items-center justify-center ml-auto">
              <Times v-if="!processingIDs.includes(session.id)" class="!w-4 !h-4" />
              <Spinner v-else class="!w-4 !h-4" />
            </button>
          </li>
        </ul>
        <FormButtonSecondary @submit="deleteAll" title="Delete all" :processing="deletingAll" />
      </div>
    </section>
    <BuildInfo v-if="!loading" />
  </SettingsLayout>
  <Modal :show="sessionDetails" @close="sessionDetails = null">
    <h2 class="text-2xl fontTheme">{{ $t('Session details') }}</h2>
    <p class="text-left">
      IP: {{ sessionDetails?.ip }}<br>
      Browser: {{ sessionDetails?.browser }}<br>
      OS: {{ sessionDetails?.os }}<br>
      Device: {{ sessionDetails?.device }}<br>
      CPU: {{ sessionDetails?.cpu }}<br>
      Type: {{ sessionDetails?.type }}<br>
      User-Agent: {{ sessionDetails?.agent }}
    </p>
  </Modal>
</template>

<script setup lang="ts">
import SettingsLayout from '@/layouts/SettingsLayout.vue'
import BuildInfo from '@/components/Settings/BuildInfo.vue'
import Spinner from '@/components/Icons/Spinner.vue'
import { onMounted, ref } from 'vue'
import request from '@/scripts/request/request'
import { useRouter } from 'vue-router'
import { UAParser } from 'ua-parser-js'
import Phone from '@/components/Icons/Phone.vue'
import Tablet from '@/components/Icons/Tablet.vue'
import Desktop from '@/components/Icons/Desktop.vue'
import Times from '@/components/Icons/Times.vue'
import Modal from '@/components/Modals/Modal.vue'
import FormButtonSecondary from '@/components/Auth/FormButtonSecondary.vue'
import { useAuthStore } from '@/stores/auth'

interface Session {
  id: number
  ip: string
  agent: string
  browser: string
  os: string
  device: string
  cpu: string
  current: boolean
  type: "desktop" | "tablet" | "mobile"
}

interface RawSession {
  id: number
  ip_address: string
  user_agent: string
  current: boolean
}

const router = useRouter()
const auth = useAuthStore()

const loading = ref(true)
const sessions = ref<Array<Session>>([])
const sessionDetails = ref<Session | null>(null)
const processingIDs = ref<Array<number>>([])
const deletingAll = ref(false)

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
      ip: s.ip_address,
      agent: s.user_agent,
      browser: data.browser.name || 'unknown',
      cpu: data.cpu.architecture || 'unknown',
      device: data.device.type || 'unknown',
      os: data.os.name || 'unknown',
      type: getType(s.user_agent),
      current: s.current,
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

const remove = async (s: Session)  => {
  const inx = sessions.value.indexOf(s)
  processingIDs.value.push(s.id)
  await request.delete(`/security/sessions/${s.id}`)
  processingIDs.value.splice(processingIDs.value.indexOf(s.id), 1)
  sessions.value.splice(inx, 1)
}

const deleteAll = async () => {
  deletingAll.value = true
  const res = await request.delete('/security/sessions')
  sessions.value = []
  deletingAll.value = false
  if(!res.data.$error && res.status == 200) await auth.logout()
}

onMounted(fetch)
</script>