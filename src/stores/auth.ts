import { defineStore } from 'pinia'
import type { User } from '@/types/user'
import { computed, type Ref, ref } from 'vue'
import { WizzlAuthToken } from '@/scripts/consts'
import request from '@/scripts/request/request'
import setup from '@/scripts/websocket/default'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) as Ref<User | null>
  const token = ref({ type: '', value: '' }) as Ref<{ type: string; value: string }>
  const checkTime = ref(minuteAgoHelper(5))

  async function login(u: User, t: string) {
    user.value = userHelper(u)
    token.value = tokenHelper(t)
    await setup(token.value.value, true)
  }

  async function logout() {
    await request.get('/logout')
    window.localStorage.removeItem(WizzlAuthToken)
    if (user.value?.id) user.value.id = 0
  }

  async function check(): Promise<boolean> {
    const res = await request.get('/me')
    if (res.data?.$error) {
      await logout()
      return false
    } else if (res.data?.user) user.value = userHelper(<User>res.data.user)
    token.value = tokenHelper(null)
    await setup(token.value.value)
    return true
  }

  function needsFresh(): boolean {
    return checkTime.value <= minuteAgoHelper(5)
  }

  const isLoggedIn = computed(() => user.value != null && user.value?.id != 0)

  return { user, token, login, logout, check, isLoggedIn, needsFresh }
})

// helpers
function tokenHelper(t: string | null = null) {
  if (t == null) {
    const st = window.localStorage.getItem(WizzlAuthToken)
    if (st == null)
      return {
        type: '',
        value: ''
      }
    t = st
  }

  window.localStorage.setItem(WizzlAuthToken, t)
  const _t = t.split(' ')
  return {
    type: _t[0],
    value: _t[1]
  }
}

function userHelper(u: User): User {
  u.image_url = u.image_url.replace('{cdn}', window.GLOBAL_ENV.CDN_HOST)
  return u
}

function minuteAgoHelper(m: number): Date {
  return new Date(Date.now() - 1000 * m)
}
