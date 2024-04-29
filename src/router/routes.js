export const constRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login'
  },
  {
    path: '/',
    component: () => import('@/views/person/PersonIndex.vue'),
    name: 'person'
  },
  {
    path: '/v2',
    component: () => import('@/views/person/PersonIndexV2.vue'),
    name: 'personv2'
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
