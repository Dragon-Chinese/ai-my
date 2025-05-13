import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/script_setting',
  component: Layout,
  redirect: '/script_setting/index',
  name: 'scriptSetting',
  meta: {
    title: '话术配置',
    icon: 'huashupeizhi',
  },
  children: [
    {
      path: 'index',
      name: 'scriptSettingIndex',
      component: () => import('@/views/script_setting/index.vue'),
      meta: {
        title: '话术配置',
        menu: false,
        breadcrumb: false,
        activeMenu: '/script_setting',
      },
    },
  ],
}

export default routes
