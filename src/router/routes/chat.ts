import ContactsView from '@/views/Chat/ContactsView.vue'
import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import ChatSettings from '@/views/Chat/Settings/ChatSettings.vue'
import ChatViewNew from '@/views/Chat/ChatView.vue'
import JoinNewChatView from '@/views/Chat/Join/JoinNewChatView.vue'
import HandleChatInviteView from '@/views/Chat/Join/HandleChatInviteView.vue'

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
    component: JoinNewChatView,
    meta: needsAuth
  },
  {
    path: '/chat/create',
    name: 'chat.create',
    component: () => import('@/views/Chat/Join/CreateChatView.vue'),
    meta: needsAuth
  },
  {
    path: '/join/:code',
    name: 'chat.invite',
    component: HandleChatInviteView,
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
  },
  {
    path: '/chat/:id/roles',
    name: 'chat.roles',
    component: () => import('@/views/Chat/Settings/RoleSettings.vue'),
    meta: needsAuth
  },
  {
    path: '/chat/:id/members',
    name: 'chat.members',
    component: () => import('@/views/Chat/Settings/ChatUsersView.vue'),
    meta: needsAuth
  }
] as Array<RouteRecordRaw>
