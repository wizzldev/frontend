import { createI18n } from 'vue-i18n'
import en from './data/en'
import hu from './data/hu'
import de from './data/de'
import useCookie from '@/composables/useCookie'
import { WizzlLocale } from '@/scripts/consts'

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.substring(0, 2),
  fallbackLocale: 'en',
  messages: {
    en,
    hu,
    de
  },
  fallbackWarn: false,
  missingWarn: false
})

export const getLocale = async () => {
  const lang = await useCookie().get(WizzlLocale)
  if (!lang) return navigator.language.substring(0, 2)
  return lang
}

export default i18n
