import { NavigationBar } from '@capgo/capacitor-navigation-bar'
import { StatusBar } from '@capacitor/status-bar'
import { isApp } from '@/scripts/mobile/isApp'

export const setTheme = async (top: string, bottom: string) => {
  if (!isApp()) return
  await NavigationBar.setNavigationBarColor({ color: bottom })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color: top })
}

export const setBottomTheme = async (bottom: string) => {
  if (!isApp()) return
  await NavigationBar.setNavigationBarColor({ color: bottom })
}

export const setTopTheme = async (top: string) => {
  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color: top })
}

export const resetTheme = async () => {
  if (!isApp()) return
  const color = '#121318'
  await NavigationBar.setNavigationBarColor({ color })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color })
}
