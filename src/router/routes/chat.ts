import ContactsView from '@/views/Chat/ContactsView.vue'
import Guard from '@/router/guard'
import NewChatView from '@/views/Chat/NewChatView.vue'
import type { RouteRecordRaw } from 'vue-router'
import ChatSettings from '@/views/Chat/ChatSettings.vue'
import ChatViewNew from '@/views/Chat/ChatView.vue'

const needsAuth = {
  auth: Guard.ACCESS_LOGIN
}

export default [
  {
    path: '/contacts',
    name: 'chat.contacts',
    component: ContactsView,
    meta: needsAuth
  },
  {
    path: '/chat/new',
    name: 'chat.new',
    component: NewChatView,
    meta: needsAuth
  },
  {
    path: '/chat/:id',
    name: 'chat.message',
    component: ChatViewNew,
    meta: needsAuth
  },
  {
    path: '/chat/:id/settings',
    name: 'chat.settings',
    component: ChatSettings,
    meta: needsAuth
  }
] as Array<RouteRecordRaw>
