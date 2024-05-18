export const constRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login'
  },
  {
    path: '/',
    component: () => import('@/views/home/index.vue'),
    children: [
      {
        path: 'personv2',
        component: () => import('@/views/person/PersonIndexV2.vue'),
        name: 'personv2'
      },
      {
        path: '/permission',
        component: () => import('@/views/permission/index.vue'),
        name: 'permission'
      },
      {
        path: '/role',
        component: () => import('@/views/role/index.vue'),
        name: 'role'
      },
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        name: 'user'
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
