import axios from 'axios'
import { isApp } from '@/scripts/mobile/isApp'
import { useLogger } from '@/stores/logger'
import { useAuth2Store } from '@/stores/auth2'

const instance = axios.create({
  baseURL: window.GLOBAL_ENV.API_ENDPOINT,
  withCredentials: true
})

instance.interceptors.request.use(
  async (config) => {
    useLogger().log('Http', `Preparing request [${config.url}]`)
    if (isApp())
      config.headers['X-Frontend-Client'] = 'Android/Vue@' + import.meta.env.VITE_BUILD_HASH_SHORT
    else config.headers['X-Frontend-Client'] = 'Web/Vue@' + import.meta.env.VITE_BUILD_HASH_SHORT
    config.headers.Authorization = useAuth2Store().token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    useLogger().log(
      'Http',
      `Resolving request [RESOLVE] - Status: ${res.status} - Data: ${res.data ? JSON.stringify(res.data) : '-'}`
    )
    if (res.data == null) res.data = { nullValue: true }
    return Promise.resolve(res)
  },
  (err) => {
    console.error('Request error', err.message)
    useLogger().log(
      'Http',
      `Resolving request [REJECT] - Status: ${err.status} - Data: ${err.response.data ? JSON.stringify(err.response.data) : '-'}`
    )

    if (!err?.response) {
      err.response = { code: 520, data: {} }
    }

    if (err?.code == 'ERR_NETWORK') err.response.data.$network = err.code

    err.response.data.$error = err
    return Promise.resolve(err.response)
  }
)

export default instance
