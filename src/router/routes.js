import { defineAsyncComponent } from 'vue'
export const constRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login'
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    name: 'Home',
    redirect: '/goods',
    children: [
      {
        path: 'goods',
        component: () => import('@/views/goods/index.vue'),
        name: 'goods'
      },
      {
        path: '/permission',
        component: defineAsyncComponent(() => import('@/views/permission/index.vue')),
        name: 'permission'
      },
      {
        path: '/role',
        component: defineAsyncComponent(() => import('@/views/role/index.vue')),
        name: 'role'
      },
      {
        path: '/user',
        component: defineAsyncComponent(() => import('@/views/user/index.vue')),
        name: 'user'
      },
      {
        path: '/user-infor',
        component: defineAsyncComponent(() => import('@/views/userInfor/index.vue')),
        name: 'userInfor'
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]
