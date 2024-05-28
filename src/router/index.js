import { createRouter, createWebHashHistory } from 'vue-router'
import { constRoutes } from './routes.js'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: constRoutes
})
let notRegisterRoute = true //是否动态添加过路由
router.beforeEach((to, from, next) => {
  // NProgress.start()
  //访问需要授权的页面时，如果没有登录，则跳转到登录界面
  const userStore = useUserStore()
  const token = userStore.userInfo.access_token
  if (!token && to.name !== 'Login') {
    ElMessage({
      message: '您还没有登录，请先登录',
      type: 'error'
    })
    next('/login')
  } else {
    next()
    // if (to.name === 'Login') return next()
    // const addRoutes = userStore.getUserRoutes()
    // const arr = []
    // addRoutes.length > 0 &&
    //   addRoutes.forEach((item) => {
    //     if (item.url) {
    //       const temp = { path: item.url, component: () => import(`@/views/${item.code}/index.vue`) }
    //       arr.push(temp)
    //     }
    //   })
    // if (notRegisterRoute) {
    //   arr.forEach((value, index) => {
    //     router.addRoute('Home', value)
    //   })
    //   router.addRoute({
    //     path: '/404',
    //     component: () => import('@/views/404/index.vue'),
    //     name: '404'
    //   })
    //   router.addRoute({ path: '/:pathMatch(.*)', redirect: '/404' })
    //   next({ ...to, replace: true })
    //   notRegisterRoute = false
    // } else {
    //   next()
    // }
  }
})
router.afterEach(() => {
  // NProgress.done()
})

export default router
