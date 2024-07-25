import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const show = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
  const toast = useToast()
  const { t } = useI18n()
  toast[type](t(message))
}

export const success = (message: string) => show(message, 'success')
export const error = (message: string) => show(message, 'error')
export const info = (message: string) => show(message, 'info')
export const warning = (message: string) => show(message, 'warning')
