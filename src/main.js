import { createApp } from 'vue'
import ElementPlus from 'element-plus'
 // @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
// import './style.css'
import '@/styles/index.scss'
import 'element-plus/theme-chalk/display.css'
// import 'virtual:svg-icons-register'
import router from '@/router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from '@/App.vue'
import SuperTable from './components/super-table/super-table.vue'
import Directive from './utils/directive/index.js'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// app.provide('$axios', axios)
app.component('SuperTable', SuperTable)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(Directive)
app.use(router)
app.use(pinia)
app.mount('#app')
