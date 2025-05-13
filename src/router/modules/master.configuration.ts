import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/master_configuration',
  component: Layout,
  redirect: '/master_configuration/index',
  name: 'MasterConfiguration',
  meta: {
    title: 'F5版本配置',
    icon: 'zhupeizhi',
  },
  children: [
    {
      path: 'index',
      name: 'tabExampleIndex',
      component: () => import('@/views/master_configuration/index.vue'),
      meta: {
        title: '主配置F5版本演示',
        menu: false,
        breadcrumb: false,
        activeMenu: '/master_configuration',
      },
    },
  ],
}

export default routes
