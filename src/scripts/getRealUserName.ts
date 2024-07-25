import { useI18n } from 'vue-i18n'

export const getRealUserName = (name: string) => {
  if (name.endsWith('#allowTranslation')) {
    return useI18n().t(name.substring(0, name.length - '#allowTranslation'.length))
  }
  return name
}