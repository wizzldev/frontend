import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import SettingsView from '@/views/SettingsView.vue'

const needsAuth = {
  auth: Guard.ACCESS_LOGIN
}

export default [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'chat.contacts' }
  },
  {
    path: '/settings',
    name: 'settings.default',
    component: SettingsView,
    meta: needsAuth
  }
] as Array<RouteRecordRaw>
