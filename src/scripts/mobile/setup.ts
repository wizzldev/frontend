import { isApp } from '@/scripts/mobile/isApp'
import { App, type URLOpenListenerEvent } from '@capacitor/app'
import type { Router } from 'vue-router'
import { setTheme } from '@/scripts/mobile/theme'
import { addListeners } from '@/scripts/mobile/notification'
import { useContactsStore } from '@/stores/contacts'
import request from '@/scripts/request/request'
import { useChatStore } from '@/stores/chat'

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

  await App.addListener('appStateChange', (state) => {
    if (state.isActive) {
      useContactsStore().reload()
      useChatStore().shouldFetchAll()
      return
    }
    useChatStore().storeChatData()
  })

  await addListeners(request, router)
}

export default setup
