import { isApp as checkIsApp } from '@/scripts/mobile/isApp'
import { CapacitorCookies } from '@capacitor/core'
import Cookies from 'js-cookie'

export default function useCookie() {
  const isApp = checkIsApp()

  const cookieOpts = { sameSite: 'Lax', domain: undefined } as  { sameSite: 'Lax', domain?: string }
  const domain = window.location.hostname
  if(!['127.0.0.1', 'localhost'].includes(domain)) cookieOpts.domain = domain

  const set = async (name: string, value: string): Promise<void> => {
    if(!isApp) Cookies.set(name, value, cookieOpts)
    else await CapacitorCookies.setCookie({
      key: name,
      value: value,
    })
  }

  const get = async (name: string): Promise<string|undefined> => {
    if(!isApp) return Cookies.get(name) as string | undefined
    const cookies = await CapacitorCookies.getCookies()
    return cookies?.[name]
  }

  const remove = async (name: string): Promise<void> => {
    if(!isApp) return Cookies.remove(name, cookieOpts)
    await CapacitorCookies.deleteCookie({
      key: name,
    })
  }

  const removeAll = async () => {
    if(isApp) return await CapacitorCookies.clearCookies({})
    const cookies = Object.keys(Cookies.get())
    cookies.forEach(cookie => remove(cookie))
  }

  return { set, get, remove, removeAll }
}