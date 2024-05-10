import { createRouter, createWebHistory } from 'vue-router'
import auth from '@/router/routes/auth'
import chat from '@/router/routes/chat'
import { useAuthStore } from '@/stores/auth'
import Guard from '@/router/guard'
import main from '@/router/routes/main'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...main, ...auth, ...chat]
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (auth.needsFresh()) await auth.check()
  if (!to?.meta?.auth) return next()

  if (auth.isLoggedIn) {
    if (to.meta.auth == Guard.ACCESS_LOGIN || to.meta.auth == Guard.ACCESS_ALL) return next()
    else if (to.meta.auth == Guard.ACCESS_NO_LOGIN) return next('/')
    return next(from)
  }

  if (to.meta.auth == Guard.ACCESS_NO_LOGIN || to.meta.auth == Guard.ACCESS_ALL) return next()
  return next(`/login?to=${from.path}`)
})

export default router
