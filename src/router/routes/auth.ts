import LoginView from '@/views/Auth/LoginView.vue'
import Guard from '@/router/guard'

export default [
  {
    path: '/login',
    name: 'auth.login',
    component: LoginView,
    meta: {
      auth: Guard.ACCESS_NO_LOGIN,
    }
  }
]
