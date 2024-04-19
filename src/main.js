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
import App from '@/App.vue'
import SuperTable from './components/super-table/super-table.vue'
import SuperTableV2 from './components/super-table-v2/super-table-v2.vue'

// createApp(App).mount('#app')
const app = createApp(App)

// app.provide('$axios', axios)
app.component('SuperTable', SuperTable)
app.component('SuperTableV2', SuperTableV2)
app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.mount('#app')
