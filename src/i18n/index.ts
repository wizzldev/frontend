import { createI18n } from 'vue-i18n'
import en from './data/en'
import hu from './data/hu'

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.substring(0, 2),
  fallbackLocale: 'en',
  messages: {
    en,
    hu
  },
  fallbackWarn: false,
  missingWarn: false
})

export default i18n
