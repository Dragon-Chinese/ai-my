import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const routes: RouteRecordRaw = {
  path: '/deepseek_reply',
  component: Layout,
  redirect: '/deepseek_reply/index',
  name: 'deepseekReply',
  meta: {
    title: 'DeepSeek智能回复',
    icon: 'zhinenghuifu',
  },
  children: [
    {
      path: 'index',
      name: 'deepseekReplyIndex',
      component: () => import('@/views/deepseek_reply/index.vue'),
      meta: {
        title: 'DeepSeek智能回复',
        menu: false,
        breadcrumb: false,
        activeMenu: '/deepseek_reply',
      },
    },
  ],
}

export default routes
