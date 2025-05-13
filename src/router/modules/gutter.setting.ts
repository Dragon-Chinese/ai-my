import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/gutter_setting',
  component: Layout,
  redirect: '/gutter_setting/index',
  name: 'gutterSetting',
  meta: {
    title: '辅助配置',
    icon: 'fuzhushezhi',
  },
  children: [
    {
      path: 'index',
      name: 'gutterSettingIndex',
      component: () => import('@/views/gutter_setting/index.vue'),
      meta: {
        title: '辅助配置',
        menu: false,
        breadcrumb: false,
        activeMenu: '/gutter_setting',
      },
    },
  ],
}

export default routes
