import { isApp } from '@/scripts/mobile/isApp'
import { App, type URLOpenListenerEvent } from '@capacitor/app'
import type { Router } from 'vue-router'
import { setTheme } from '@/scripts/mobile/theme'

const setup = async (router: Router) => {
  if (!isApp()) return
  const color = '#121318'

  await setTheme(color, color)

  await App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp()
    } else {
      window.history.back()
    }
  })

  await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    const slug = event.url.split('.app').pop()
    if (slug) router.push({ path: slug })
  })
}

export default setup
