import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/commerce_pop_up',
  component: Layout,
  redirect: '/commerce_pop_up/index',
  name: 'commercePopUp',
  meta: {
    title: '抖音带货自动弹窗',
    icon: 'douyindaihuo',
  },
  children: [
    {
      path: 'index',
      name: 'commercePopUpIndex',
      component: () => import('@/views/commerce_pop_up/index.vue'),
      meta: {
        title: '抖音带货自动弹窗',
        menu: false,
        breadcrumb: false,
        activeMenu: '/commerce_pop_up',
      },
    },
  ],
}

export default routes
