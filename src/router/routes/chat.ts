import ContactsView from '@/views/Chat/ContactsView.vue'
import ChatView from '@/views/Chat/ChatView.vue'
import Guard from '@/router/guard'

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
    path: '/chat/:id',
    name: 'chat.message',
    component: ChatView,
    meta: needsAuth
  }
]
