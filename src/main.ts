import './assets/styles/main.css'
import 'vue-toastification/dist/index.css'
// customized
import './assets/styles/customization/toast.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from '@/i18n'
import Toast, { useToast } from 'vue-toastification'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const app = createApp(App)

app.use(Toast, {})
app.use(i18n)
app.use(createPinia())
app.use(router)

app.config.globalProperties.$time = timeAgo
app.config.globalProperties.$toast = useToast()

app.mount('#app')
