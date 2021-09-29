import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '用户列表', icon: 'el-icon-user' }
    }]
  },
  {
    path: '/waybill',
    component: Layout,
    redirect: '/waybill/waybillList',
    name: 'Waybill',
    meta: { title: '运单管理', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'waybillList',
        name: 'WaybillList',
        component: () => import('@/views/waybill/waybillList'),
        meta: { title: '运单列表', icon: '' }
      },
      {
        path: 'waybillManagement',
        name: 'WaybillManagement',
        component: () => import('@/views/waybill/waybillManagement'),
        meta: { title: '运费管理', icon: '' }
      },
      {
        path: 'invoiceManagement',
        name: 'invoiceManagement',
        component: () => import('@/views/waybill/invoiceManagement'),
        meta: { title: '开票管理', icon: '' }
      }
    ]
  },
  // {
  //   path: '/operator',
  //   component: Layout,
  //   redirect: '/operator',
  //   children: [{
  //     path: 'operator',
  //     name: 'Operator',
  //     component: () => import('@/views/operator/index'),
  //     meta: { title: '运营设置', icon: 'el-icon-s-tools' }
  //   }]
  // },
  {
    path: '/operator',
    component: Layout,
    redirect: '/operator/operatorList',
    name: 'Operator',
    alwaysShow: true,
    meta: { title: '内容管理', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'operatorList',
        name: 'OperatorList',
        component: () => import('@/views/operator/operatorList'),
        meta: { title: '运营设置', icon: '' }
      },
      {
        path: 'swiper',
        name: 'Swiper',
        component: () => import('@/views/operator/swiper'),
        meta: { title: '轮播管理', icon: '' }
      },
      // {
      //   path: 'swiper',
      //   component: () => import('@/views/operator/index'), // Parent router-view
      //   name: 'Swiper',
      //   redirect: '/operator/swiper/swiperList',
      //   meta: { title: '轮播管理' },
      //   children: [
      //     {
      //       path: 'swiperList',
      //       component: () => import('@/views/operator/swiper'),
      //       name: 'SwiperList',
      //       hidden: true,
      //       meta: { title: '列表' }
      //     },
      //     {
      //       path: 'swiperDetail',
      //       component: () => import('@/views/operator/swiperDetail'),
      //       name: 'SwiperDetail',
      //       hidden: true,
      //       meta: { title: query => {return query.id ? '编辑' : '新增'} }
      //     }
      //   ]
      // }
    ]
  },
  // {
  //   path: '/detail',
  //   component: Layout,
  //   redirect: '/detail',
  //   children: [{
  //     path: 'detail',
  //     name: 'Detail',
  //     component: () => import('@/views/detail/index'),
  //     meta: { title: '流水明细', icon: 'el-icon-tickets' }
  //   }]
  // },
  {
    path: '/platform',
    component: Layout,
    redirect: '/platform/water',
    name: 'Platform',
    alwaysShow: true,
    meta: { title: '平台明细', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'water',
        name: 'Water',
        component: () => import('@/views/platform/water'),
        meta: { title: '流水明细', icon: '' }
      }
    ]
  },

  {
    path: '/backstage',
    component: Layout,
    redirect: '/backstage/account',
    name: 'Backstage',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-unfold'
    },
    children: [
      {
        path: 'account',
        component: () => import('@/views/backstage/index'), // Parent router-view
        name: 'Account',
        redirect: '/backstage/account/accountList',
        meta: { title: '账号管理' },
        children: [
          {
            path: 'accountList',
            component: () => import('@/views/backstage/account'),
            name: 'AccountList',
            hidden: true,
            meta: { title: '列表' }
          },
          {
            path: 'accountDetail',
            component: () => import('@/views/backstage/accountDetail'),
            name: 'AccountDetail',
            hidden: true,
            meta: { title: query => {return query.id ? '编辑' : '新增'} }
          }
        ]
      }
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
