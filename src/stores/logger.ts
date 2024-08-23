import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLogger = defineStore('logger', () => {
  const logs = ref<{
    date: Date
    resource: string
    message: string
  }[]>([])

  function log(resource: string, message: string) {
    logs.value.push({
      date: new Date(),
      resource,
      message,
    })
  }

  function get() {
    return logs.value
  }

  return {
    log,
    get
  }
})