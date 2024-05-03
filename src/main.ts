import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from '@/i18n'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.config.globalProperties.$time = timeAgo

app.mount('#app')
