import type Server from '@/scripts/websocket/server'

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

export {}
