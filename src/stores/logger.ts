import { defineStore } from 'pinia'
import { ref } from 'vue'

type LogLevel = 'default' | 'info' | 'warn' | 'error'

export const useLogger = defineStore('logger', () => {
  const logs = ref<{
    date: Date
    resource: string
    message: string
    level: LogLevel
  }[]>([])

  function log(resource: string, message: string, level: LogLevel = 'default') {
    logs.value.push({
      date: new Date(),
      resource,
      message,
      level,
    })
    console.debug(`(useLogger) New Logs: [${resource}]: ${message}`)
  }

  function get() {
    return logs.value
  }

  return {
    log,
    get
  }
})