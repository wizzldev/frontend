import { NavigationBar } from '@capgo/capacitor-navigation-bar'
import { StatusBar } from '@capacitor/status-bar'
import { isApp } from '@/scripts/mobile/isApp'
import { App, type URLOpenListenerEvent } from '@capacitor/app'
import type { Router } from 'vue-router'

const setup = async (router: Router) => {
  if (!isApp()) return
  const color = '#121318'
  await NavigationBar.setNavigationBarColor({ color })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color })

  await App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp()
    } else {
      window.history.back()
    }
  })

  await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    const slug = event.url.split(".app").pop();
    if (slug) router.push({path: slug});
  })
}

export default setup
