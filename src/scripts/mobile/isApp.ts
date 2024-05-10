import { Capacitor } from '@capacitor/core'

export const isApp = (): boolean => {
  return Capacitor.isNativePlatform()
}
