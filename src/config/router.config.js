// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: 'workplace',
        name: 'Workplace',
        component: () => import('@/views/dashboard/Workplace'),
        meta: { title: '工作台', keepAlive: true, icon: 'solution' }
      },
      {
        path: '/project',
        name: 'project',
        component: () => import('@/views/Project'),
        meta: { title: '项目列表', keepAlive: true, icon: 'solution' },
        permissions: [0]
      },
      {
        path: '/project/:projectId',
        name: 'mock',
        component: () => import('@/views/mock/Index'),
        redirect: '/project/:projectId/all',
        hidden: true,
        meta: { title: 'Mock列表', permission: [0] },
        children: [
          {
            path: '/project/:projectId/:categoryId',
            name: 'mockList',
            component: () => import('@/views/mock/List')
          },
          {
            path: '/project/:projectId/:categoryId/:mockId',
            name: 'mockDetail',
            component: () => import('@/views/mock/Detail')
          }
        ]
      },
      {
        path: '/project2/:projectId',
        name: 'mock2',
        component: () => import('@/views/mock/Mock'),
        hidden: true,
        meta: { title: 'Mock列表', permission: [0] }
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
