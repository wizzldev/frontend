import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import SettingsView from '@/views/Settings/SettingsView.vue'
import TermsOfServiceView from '@/views/Terms/TermsOfServiceView.vue'
import PrivacyPolicyView from '@/views/Terms/PrivacyPolicyView.vue'
import SessionsView from '@/views/Settings/SessionsView.vue'
import IPView from '@/views/Settings/IPView.vue'
import HomeView from '@/views/HomeView.vue'

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
    component: TermsOfServiceView
  },
  {
    path: '/privacy',
    name: 'service.privacy',
    component: PrivacyPolicyView
  }
] as Array<RouteRecordRaw>
