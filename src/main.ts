import './assets/styles/main.css'
import 'vue-toastification/dist/index.css'
import 'tippy.js/dist/tippy.css'
import 'vue-advanced-cropper/dist/style.css'
// customized
import './assets/styles/customization/toast.css'
import './assets/styles/customization/tippy.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from '@/i18n'
import Toast, { useToast } from 'vue-toastification'
import VueTippy from 'vue-tippy'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import twemoji from 'twemoji'
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const app = createApp(App)

app.use(Toast, {})
app.use(i18n)
app.use(VueTippy)
app.use(createPinia())
app.use(router)

app.directive('emoji', {
  mounted: (el: HTMLElement) => {
    twemoji.parse(el, { size: 'svg', ext: '.svg' })
  }
})

app.config.globalProperties.$time = timeAgo
app.config.globalProperties.$toast = useToast()

app.mount('#app')
