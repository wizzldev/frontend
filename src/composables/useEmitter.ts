import { getCurrentInstance } from 'vue'
import type { Emitter } from 'mitt'

export default function useEmitter(): Emitter<any> {
  const internalInstance = getCurrentInstance()
  return internalInstance?.appContext.config.globalProperties.emitter
}
