import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import SettingsView from '@/views/Settings/SettingsView.vue'
import SessionsView from '@/views/Settings/SessionsView.vue'
import IPView from '@/views/Settings/IPView.vue'
import HomeView from '@/views/HomeView.vue'
import GuardTypes from '@/router/guard'

const needsAuth = {
  auth: Guard.ACCESS_LOGIN
}

export default [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/settings',
    name: 'settings.default',
    component: SettingsView,
    meta: needsAuth
  },
  {
    path: '/settings/sessions',
    name: 'settings.sessions',
    component: SessionsView,
    meta: needsAuth
  },
  {
    path: '/settings/ips',
    name: 'settings.ips',
    component: IPView,
    meta: needsAuth
  },
  {
    path: '/terms',
    name: 'service.terms',
    component: () => import('@/views/Terms/TermsOfServiceView.vue')
  },
  {
    path: '/privacy',
    name: 'service.privacy',
    component: () => import('@/views/Terms/PrivacyPolicyView.vue')
  },
  {
    path: '/__dev/logs',
    name: 'dev.logs',
    component: () => import('@/views/Dev/AppLogs.vue')
  },
  {
    path: '/__dev/cookies',
    name: 'dev.cookies',
    component: () => import('@/views/Dev/Cookies.vue')
  }
] as Array<RouteRecordRaw>
