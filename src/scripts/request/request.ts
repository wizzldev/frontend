import axios from 'axios'
import { WizzlAuthToken } from '@/scripts/consts'

const instance = axios.create({
  baseURL: window.GLOBAL_ENV.API_ENDPOINT,
  withCredentials: true
})

instance.interceptors.request.use(
  async (config) => {
    config.headers['X-Frontend-Client'] = 'Web/Vue@build:alpha'
    config.headers.Authorization = window.localStorage.getItem(WizzlAuthToken)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res) => {
    if (res.data == null) res.data = { nullValue: true }
    return Promise.resolve(res)
  },
  (err) => {
    console.error(err.message)

    if (!err?.response) {
      err.response = { code: 520, data: {} }
    }

    if (err?.code == 'ERR_NETWORK') err.response.data.$network = err.code

    err.response.data.$error = err
    return Promise.resolve(err.response)
  }
)

export default instance
