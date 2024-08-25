import { createI18n } from 'vue-i18n'
import en from './data/en'
import hu from './data/hu'
import useCookie from '@/composables/useCookie'
import { WizzlLocale } from '@/scripts/consts'

const getLocale = async () => {
  const lang = await useCookie().get(WizzlLocale)
  if(!lang) return navigator.language.substring(0, 2)
  return lang
}

const i18n = createI18n({
  legacy: false,
  locale: await getLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    hu
  },
  fallbackWarn: false,
  missingWarn: false
})

export default i18n
