import { isApp } from '@/scripts/mobile/isApp'
import Cookies from 'js-cookie'
import { addMonths } from 'date-fns'
import { CapacitorCookies } from '@capacitor/core'

const getCookieExpirationData = () => {
  return addMonths(new Date(), 1)
}

const getCookieConfig = () => {
  const domain = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? undefined
    : `.${window.location.hostname}`
  const sameSite = 'Lax' as 'Strict' | 'Lax' | 'None' | undefined
  const expires = getCookieExpirationData()

  return { domain, sameSite, expires }
}

export default function useCookie() {
  const set = async (key: string, value: string) => {
    if (isApp()) return await setAppCookie(key, value)
    Cookies.set(key, value, getCookieConfig())
  }

  const setAppCookie = async (key: string, value: string) => {
    await CapacitorCookies.setCookie({
      key,
      value,
      expires: getCookieExpirationData().toUTCString()
    })
  }

  const get = async (key: string): Promise<string | undefined> => {
    if (isApp()) return await getAppCookie(key)
    return Cookies.get(key)
  }

  const getAppCookie = async (key: string): Promise<string | undefined> => {
    const data = await CapacitorCookies.getCookies()
    return data?.[key] || undefined
  }

  const remove = async (key: string): Promise<void> => {
    if (isApp()) return await removeAppCookie(key)
    Cookies.remove(key, getCookieConfig())
  }

  const removeAppCookie = async (key: string): Promise<void> => {
    await CapacitorCookies.deleteCookie({ key })
  }

  const removeAll = async (): Promise<void> => {
    if (isApp()) return await removeAllAppCookie()
    Object.keys(Cookies.get()).forEach((key) => remove(key))
  }

  const removeAllAppCookie = async (): Promise<void> => {
    await CapacitorCookies.clearAllCookies()
  }

  const getAll = async (): Promise<Record<string, string>> => {
    if (isApp()) return getAllAppCookie()
    return Cookies.get()
  }

  const getAllAppCookie = async () => {
    return await CapacitorCookies.getCookies()
  }

  return { set, get, getAll, remove, removeAll }
}
