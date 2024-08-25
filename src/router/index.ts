import { createRouter, createWebHistory } from 'vue-router'
import auth from '@/router/routes/auth'
import chat from '@/router/routes/chat'
import { useAuth2Store } from '@/stores/auth2'
import Guard from '@/router/guard'
import main from '@/router/routes/main'
import NotFound from '@/views/NotFound.vue'
import { useLogger } from '@/stores/logger'
import { useLoader } from '@/stores/loader'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...main,
    ...auth,
    ...chat,
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: NotFound
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  useLogger().log('Router', `Moving to ${to.fullPath}`)

  const loader = useLoader()
  const auth = useAuth2Store()

  if (auth.needsFresh) {
    await auth.freshCheck()
  }

  loader.loading = false
  if (!to?.meta?.auth) {
    return next()
  }

  if (auth.isLoggedIn) {
    if (to.meta.auth == Guard.ACCESS_LOGIN || to.meta.auth == Guard.ACCESS_ALL) return next()
    else if (to.meta.auth == Guard.ACCESS_NO_LOGIN) return next('/')
    return next(from)
  }

  if (to.meta.auth == Guard.ACCESS_NO_LOGIN || to.meta.auth == Guard.ACCESS_ALL) return next()

  return next(`/login?to=${from.path}`)
})

export default router
