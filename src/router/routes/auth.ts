import LoginView from '@/views/Auth/LoginView.vue'
import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import RegisterView from '@/views/Auth/RegisterView.vue'

const noLogin = {
  auth: Guard.ACCESS_NO_LOGIN
}

export default [
  {
    path: '/login',
    name: 'auth.login',
    component: LoginView,
    meta: noLogin
  },
  {
    path: '/register',
    name: 'auth.register',
    component: RegisterView,
    meta: noLogin
  }
] as Array<RouteRecordRaw>
