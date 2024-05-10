import type Server from '@/scripts/websocket/server'
import type TimeAgo from 'javascript-time-ago'

declare global {
  interface Window {
    GLOBAL_ENV: {
      API_ENDPOINT: string
      API_VERSION: number
      WS_ENDPOINT: string
      CDN_HOST: string
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
