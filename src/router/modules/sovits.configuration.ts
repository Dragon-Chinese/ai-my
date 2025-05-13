import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/sovits_configuration',
  component: Layout,
  redirect: '/sovits_configuration/index',
  name: 'SoVitsConfiguration',
  meta: {
    title: 'SoVits版本配置',
    icon: 'zhupeizhi',
  },
  children: [
    {
      path: 'index',
      name: 'tabExampleIndex2',
      component: () => import('@/views/sovits_configuration/index.vue'),
      meta: {
        title: '主配置SoVits版本演示',
        menu: false,
        breadcrumb: false,
        activeMenu: '/sovits_configuration',
      },
    },
  ],
}

export default routes
