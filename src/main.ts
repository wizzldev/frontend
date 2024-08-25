import './assets/styles/main.css'
import 'vue-toastification/dist/index.css'
import 'tippy.js/dist/tippy.css'
import 'vue-advanced-cropper/dist/style.css'
import 'highlight.js/styles/atom-one-dark.min.css'
import 'bottom-sheet-vue3/style.css'
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
import VueHighlightJS from 'vue3-highlightjs'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import twemoji from 'twemoji'
import { createBottomSheet } from 'bottom-sheet-vue3'
import mitt from 'mitt'
import resetStore from '@/stores/helpers'
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')
const emitter = mitt()

const app = createApp(App)

const pinia = createPinia()
pinia.use(resetStore)


app.use(pinia)
app.use(Toast, {})
app.use(i18n)
app.use(VueTippy)
app.use(VueHighlightJS)
app.use(createBottomSheet())
app.use(router)

app.directive('emoji', {
  mounted: (el: HTMLElement) => {
    twemoji.parse(el, {
      size: 'svg',
      ext: '.svg',
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
    })
  },
  updated: (el: HTMLElement) => {
    twemoji.parse(el, {
      size: 'svg',
      ext: 'svg',
      base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/'
    })
  }
})

app.config.globalProperties.$time = timeAgo
app.config.globalProperties.$toast = useToast()
app.config.globalProperties.emitter = emitter

app.mount('#app')
