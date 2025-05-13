import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/intelligent_rewriting',
  component: Layout,
  redirect: '/intelligent_rewriting/index',
  name: 'intelligentRewriting',
  meta: {
    title: '违禁词&智能重写',
    icon: 'weijinci',
  },
  children: [
    {
      path: 'index',
      name: 'intelligentRewritingIndex',
      component: () => import('@/views/intelligent_rewriting/index.vue'),
      meta: {
        title: '随播智能AI设置',
        menu: false,
        breadcrumb: false,
        activeMenu: '/intelligent_rewriting',
      },
    },
  ],
}

export default routes
