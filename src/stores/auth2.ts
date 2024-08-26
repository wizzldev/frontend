import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { AuthStore } from '@/types/auth'
import type { User } from '@/types/user'
import useCookie from '@/composables/useCookie'
import { WizzlAuthToken } from '@/scripts/consts'
import { useLogger } from '@/stores/logger'
import { setup as startWS } from '@/scripts/ws/default'
import request from '@/scripts/request/request'
import { addMinutes } from 'date-fns'

const saveToken = async (token: string) => {
  const cookie = useCookie()
  await cookie.set(WizzlAuthToken, token)
}

const getToken = async (): Promise<string | undefined> => {
  const cookie = useCookie()
  return await cookie.get(WizzlAuthToken)
}

const removeToken = async () => {
  const cookie = useCookie()
  await cookie.remove(WizzlAuthToken)
}

const initWebSocket = async (token: string, force: boolean = false) => {
  const parts = token.split(' ')
  if(parts.length > 0) await startWS(parts[parts.length - 1], force)
}

const log = (message: string) => {
  useLogger().log('Stores.Auth', message)
}

export const useAuth2Store = defineStore('auth2', () => {
  const store = reactive<AuthStore>({
    user: undefined,
    token: undefined,
    checkTime: new Date(),
  })

  const isLoggedIn = computed(() => !!store.user)
  const needsFresh = computed(() => store.checkTime.getTime() < new Date().getTime())
  const user = computed(() => store.user)
  const token = computed(() => store.token)

  const updateUser = (user: User) => {
    store.user = user
  }

  const init = async () => {
    store.token = await getToken()
  }

  const login = async (user: User, token: string) => {
    log(`Logging in with id: ${user.id}`)
    store.user = user
    store.token = token
    await saveToken(token)
    await initWebSocket(token, true)
    store.checkTime = addMinutes(new Date(), 5)
  }

  const logout = async () => {
    log(`Logging out with id: ${store.user?.id}`)
    await removeToken()
    await request.get('/logout')
    store.user = undefined
    store.token = undefined
    window.WS.disconnect()
  }

  const freshCheck = async (): Promise<boolean> => {
    if(!needsFresh.value) {
      log(`FreshCheck (Cached) for user with id: ${store.user?.id || 'unknown'}`)
      return isLoggedIn.value
    }

    log(`FreshCheck for user with id: ${store.user?.id || 'unknown'}`)

    if(!store.token) {
      log('FreshCheck: Getting token from cookies.')
      store.token = await getToken()
    }
    if(!store.token) {
      log('FreshCheck: Token not found in cookies.')
      return false
    }

    const res = await request.get('/me')

    if((res.data.$error && !res.data.$network) || !res.data?.user) {
      await logout()
      return false
    }

    store.user = res.data.user as User

    await initWebSocket(store.token)

    store.checkTime = addMinutes(new Date(), 5)

    return true
  }

  return {
    init, // initialization method
    // variables
    user: user, token: token,
    // computed
    isLoggedIn, needsFresh,
    // setters
    updateUser,
    // methods
    login, logout, freshCheck,
  }
})