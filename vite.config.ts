import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { execSync } from 'node:child_process'

const setBuildEnv = () => {
  const info = execSync('git show -s --format=\'{"hash": "%H", "hash_short": "%h", "date": "%cD" }\'').toString().trimEnd()
  const json = <{ hash: string; hash_short: string; date: string }>JSON.parse(info)
  process.env.VITE_BUILD_HASH = json.hash
  process.env.VITE_BUILD_HASH_SHORT = json.hash_short
  process.env.VITE_BUILD_DATE = json.date
  process.env.VITE_BRANCH = execSync('git rev-parse --abbrev-ref HEAD').toString().trimEnd()
}

setBuildEnv()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
