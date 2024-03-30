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


// createApp(App).mount('#app')
const app = createApp(App);

// app.provide('$axios', axios)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.mount('#app')