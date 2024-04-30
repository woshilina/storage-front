import { createRouter, createWebHashHistory } from 'vue-router'
import { constRoutes } from './routes.js'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: constRoutes
})

router.beforeEach((to, from, next) => {
  //访问需要授权的页面时，如果没有登录，则跳转到登录界面
  const userStore = useUserStore()
  const token = userStore.userInfo.access_token
  if (!token && to.name !== 'login') {
    ElMessage({
      message: '您还没有登录，请先登录',
      type: 'error'
    })
    next('/login')
  } else {
    next()
  }
})

export default router
