export const constRoutes=[
    {
      path: "/login",
      component: () => import("@/views/login/index.vue"),
      name: "login",
    },
    {
      path: "/",
      component: () => import("@/components/super-table/super-table.vue"),
      name: "super-table",
    },
    // {
    //   path: "/",
    //   component: () => import("@/views/personnel/PersonnelIndex.vue"),
    //   name: "personnel",
    // },
    {
        path: "/404",
        component: () => import("@/views/404/index.vue"),
        name: "404",
      },
      {
        path:'/:pathMatch(.*)*',
        redirect:'/404'
      }
  ]