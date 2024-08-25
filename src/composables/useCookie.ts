import { isApp } from '@/scripts/mobile/isApp'
import Cookies from 'js-cookie'
import { Preferences } from '@capacitor/preferences'

export default function useCookie() {
  const cookieOpts = { sameSite: 'Lax', domain: undefined } as  { sameSite: 'Lax', domain?: string }
  const domain = window.location.hostname
  if(!['127.0.0.1', 'localhost'].includes(domain)) cookieOpts.domain = domain

  const set = async (name: string, value: string): Promise<void> => {
    if(!isApp()) Cookies.set(name, value, cookieOpts)
    else await Preferences.set({
      key: name,
      value: value,
    })
  }

  const get = async (name: string): Promise<string|undefined> => {
    if(!isApp()) return Cookies.get(name) as string | undefined
    const { value } = await Preferences.get({key: name})
    return value || undefined
  }

  const remove = async (name: string): Promise<void> => {
    if(!isApp()) return Cookies.remove(name, cookieOpts)
    await Preferences.remove({
      key: name,
    })
  }

  const removeAll = async () => {
    let cookies
    if(isApp()) {
      const { keys } = await Preferences.keys()
      cookies = keys
    }
    else cookies = Object.keys(Cookies.get())
    cookies.forEach(cookie => remove(cookie))
  }

  return { set, get, remove, removeAll }
}