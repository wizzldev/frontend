import LoginView from '@/views/Auth/LoginView.vue'
import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import RegisterView from '@/views/Auth/RegisterView.vue'
import ResetPasswordView from '@/views/Auth/ResetPasswordView.vue'
import VerifyEmailView from '@/views/Auth/VerifyEmailView.vue'
import RequestResetPasswordView from '@/views/Auth/RequestResetPasswordView.vue'
import EmailVerificationView from '@/views/Auth/EmailVerificationView.vue'
import IPVerification from '@/views/Auth/IPVerification.vue'

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
    component: RequestResetPasswordView,
    meta: noLogin
  },
  {
    path: '/set-password/:token',
    name: 'auth.set-password',
    component: ResetPasswordView,
    meta: noLogin
  },
  {
    path: '/email-verification',
    name: 'auth.email-verification',
    component: EmailVerificationView
  },
  {
    path: '/verify-email/:token',
    name: 'auth.verify-email',
    component: VerifyEmailView
  },
  {
    path: '/ip-verification/:token',
    name: 'auth.ip-verification',
    component: IPVerification,
  }
] as Array<RouteRecordRaw>
