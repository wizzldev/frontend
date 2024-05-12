import { NavigationBar } from '@capgo/capacitor-navigation-bar'
import { StatusBar } from '@capacitor/status-bar'
import { isApp } from '@/scripts/mobile/isApp'
import { App } from '@capacitor/app'

const setup = async () => {
  if (!isApp()) return
  const color = '#121318'
  await NavigationBar.setNavigationBarColor({ color })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color })

  if (isApp())
    await App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp()
      } else {
        window.history.back()
      }
    })
}

export default setup
