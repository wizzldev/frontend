import { NavigationBar } from '@capgo/capacitor-navigation-bar'
import { StatusBar } from '@capacitor/status-bar'
import { isApp } from '@/scripts/mobile/isApp'
import { useLogger } from '@/stores/logger'

export const setTheme = async (top: string, bottom: string) => {
  if (!isApp()) return

  useLogger().log('Theme.Mobile', `Mobile theme change: top ${top} bottom ${bottom}`)

  await NavigationBar.setNavigationBarColor({ color: bottom })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color: top })
}

export const setBottomTheme = async (bottom: string) => {
  if (!isApp()) return

  useLogger().log('Theme.Mobile', `Mobile theme change: bottom ${bottom}`)

  await NavigationBar.setNavigationBarColor({ color: bottom })
}

export const setTopTheme = async (top: string) => {
  if(!isApp()) return

  useLogger().log('Theme.Mobile', `Mobile theme change: top ${top}`)

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color: top })
}

export const resetTheme = async () => {
  if (!isApp()) return

  useLogger().log('Theme.Mobile', 'Resetting theme.')

  const color = '#121318'
  await NavigationBar.setNavigationBarColor({ color })

  await StatusBar.setOverlaysWebView({ overlay: false })
  await StatusBar.setBackgroundColor({ color })
}
