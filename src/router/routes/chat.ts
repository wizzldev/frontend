import ContactsView from '@/views/Chat/ContactsView.vue'
import Guard from '@/router/guard'
import type { RouteRecordRaw } from 'vue-router'
import ChatSettings from '@/views/Chat/Settings/ChatSettings.vue'
import ChatViewNew from '@/views/Chat/ChatView.vue'
import RoleSettings from '@/views/Chat/Settings/RoleSettings.vue'
import CreateChatView from '@/views/Chat/Join/CreateChatView.vue'
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
    component: CreateChatView,
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
    component: RoleSettings,
    meta: needsAuth
  }
] as Array<RouteRecordRaw>
