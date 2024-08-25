import type TimeAgo from 'javascript-time-ago'
import type Server from '@/scripts/ws/server'

declare global {
  interface Window {
    GLOBAL_ENV: {
      DOMAIN: string
      API_ENDPOINT: string
      API_VERSION: string
      WS_ENDPOINT: string
      CDN_HOST: string
      SUPPORT_HOST: string
      INVITE_HOST: string
      MODE: string
      STATIC: string
      LINK_HOST: string
      DEVS_HOST: string
    }
    WS: Server
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $time: TimeAgo
  }
}

export {}
