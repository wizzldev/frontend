import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouteLoaderStore = defineStore('routeLoader', () => {
  const isLoaded = ref(false)
  const networkError = ref(false)

  return { isLoaded, networkError }
})
