import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'

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
  },
  {
    path: '/reset-password',
    name: 'auth.reset-password',
    component: () => import('@/views/Auth/RequestResetPasswordView.vue'),
    meta: noLogin
  },
  {
    path: '/reset-password/:token',
    name: 'auth.set-password',
    component: () => import('@/views/Auth/ResetPasswordView.vue'),
    meta: noLogin
  },
  {
    path: '/email-verification',
    name: 'auth.email-verification',
    component: () => import('@/views/Auth/EmailVerificationView.vue')
  },
  {
    path: '/verify-email/:token',
    name: 'auth.verify-email',
    component: () => import('@/views/Auth/VerifyEmailView.vue')
  },
  {
    path: '/ip-verification/:token',
    name: 'auth.ip-verification',
    component: () => import('@/views/Auth/IPVerification.vue')
  }
] as Array<RouteRecordRaw>
