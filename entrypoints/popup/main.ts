import '@/assets/styles/global.css'
import { i18n } from '@/i18n'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './style.css'

import { createApp } from 'vue'
// @ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'
import App from './App.vue'

createApp(App).use(VueVirtualScroller).use(i18n).mount('#app')
