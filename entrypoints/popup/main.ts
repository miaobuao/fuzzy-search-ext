import '@/assets/styles/global.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './style.css'

import { createApp } from 'vue'
// @ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'
import App from './App.vue'

createApp(App).use(VueVirtualScroller).mount('#app')
