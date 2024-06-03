import { NavigationBar } from '@capgo/capacitor-navigation-bar'
import { StatusBar } from '@capacitor/status-bar'
import { isApp } from '@/scripts/mobile/isApp'

export const setTheme = async (top: string, bottom: string) => {
  if(!isApp()) return
  await NavigationBar.setNavigationBarColor({ color: top })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color: bottom })
}

export const resetTheme = async () => {
  if(!isApp()) return
  const color = '#121318'
  await NavigationBar.setNavigationBarColor({ color })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color })
}
