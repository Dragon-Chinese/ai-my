import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/verify',
  component: Layout,
  redirect: '/verify/index',
  name: 'verify',
  meta: {
    title: '随播AI验证页',
    icon: 'i-ic:round-tab',
  },
  children: [
    {
      path: 'index',
      name: 'verifyIndex',
      component: () => import('@/views/verify/index.vue'),
      meta: {
        title: '随播AI验证页',
        menu: false,
        breadcrumb: false,
        activeMenu: '/verify',
      },
    },
  ],
}

export default routes
