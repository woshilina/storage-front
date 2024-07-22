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
import SvgIcon from './components/SvgIcon.vue'
import ElIconSelect from './components/el-icon-select/index.vue'
import Directive from './utils/directive/index.js'
import * as ElIcons from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'
import 'element-plus/theme-chalk/dark/css-vars.css'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// app.provide('$axios', axios)
// Object.keys(ElIcons).forEach((key) => {
//   app.component(key, ElIcons[key])
// })
app.component('SuperTable', SuperTable)
app.component('SvgIcon', SvgIcon)
app.component('ElIconSelect', ElIconSelect)

app.use(ElementPlus, {
  locale: zhCn
})
app.use(Directive)
app.use(router)
app.use(pinia)
app.mount('#app')
