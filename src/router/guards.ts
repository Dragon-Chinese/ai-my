// src/router/guards.ts
import type { Router, RouteRecordRaw } from 'vue-router'
import useKeepAliveStore    from '@/store/modules/keepAlive'
import useMenuStore         from '@/store/modules/menu'
import useRouteStore        from '@/store/modules/route'
import useSettingsStore     from '@/store/modules/settings'
import { useStore }         from '@/store/all'
import { useNProgress }     from '@vueuse/integrations/useNProgress'
import { asyncRoutes, asyncRoutesByFilesystem } from './routes'
import '@/assets/styles/nprogress.css'

export default function setupGuards(router: Router) {
  setupRoutes(router)
  setupProgress(router)
  setupTitle(router)
  setupKeepAlive(router)
  setupOther(router)
}

function setupRoutes(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const settingsStore = useSettingsStore()
    const userStore     = useStore()
    const routeStore    = useRouteStore()
    const menuStore     = useMenuStore()

    // —— 1. 非 login 页面 && 未登录：跳转到 login，并带上 redirect 查询 —— 
    if (to.name !== 'login' && !userStore.isLogin) {
      return next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    }
    // —— 2. 已登录 访问 login：直接去主页 —— 
    if (to.name === 'login' && userStore.isLogin) {
      return next({ path: settingsStore.settings.home.fullPath, replace: true })
    }

    // —— 3. 已登录 && 动态路由未生成：先生成并注册路由 —— 
    if (userStore.isLogin && !routeStore.isGenerate) {
      try {
        // 拉取权限（如果打开了权限开关）
        settingsStore.settings.app.enablePermission && await userStore.getPermissions()

        // 生成路由数据
        switch (settingsStore.settings.app.routeBaseOn) {
          case 'frontend':
            routeStore.generateRoutesAtFront(asyncRoutes)
            break
          case 'backend':
            await routeStore.generateRoutesAtBack()
            break
          case 'filesystem':
            routeStore.generateRoutesAtFilesystem(asyncRoutesByFilesystem)
            // 生成文件系统路由之后，还要生成菜单
            if (settingsStore.settings.menu.baseOn === 'frontend') {
              menuStore.generateMenusAtFront()
            } else {
              await menuStore.generateMenusAtBack()
            }
            break
        }

        // 注册新路由，并记录删除回调
        const removeRoutes: (() => void)[] = []
        routeStore.routes.forEach(r => {
          if (!/^(?:https?:|mailto:|tel:)/.test(r.path)) {
            removeRoutes.push(router.addRoute(r as RouteRecordRaw))
          }
        })
        if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
          routeStore.systemRoutes.forEach(r => {
            removeRoutes.push(router.addRoute(r as RouteRecordRaw))
          })
        }
        routeStore.setCurrentRemoveRoutes(removeRoutes)
      }
      catch {
        // 出错就登出
        userStore.logout()
        return next({ name: 'login' })
      }
      // 注入完成后，重新进入当前页面
      return next({ path: to.fullPath, query: to.query, replace: true })
    }

    // —— 4. 已登录 & 已生成路由：正常放行，并同步菜单选中 —— 
    if (settingsStore.settings.menu.mode !== 'single') {
      menuStore.setActived(to.path)
    }
    next()
  })
}

function setupProgress(router: Router) {
  const { isLoading } = useNProgress()
  router.beforeEach((_to, _from, next) => {
    if (useSettingsStore().settings.app.enableProgress) {
      isLoading.value = true
    }
    next()
  })
  router.afterEach(() => {
    if (useSettingsStore().settings.app.enableProgress) {
      isLoading.value = false
    }
  })
}

function setupTitle(router: Router) {
  router.afterEach(to => {
    const settingsStore = useSettingsStore()
    if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
      settingsStore.setTitle(to.matched.at(-1)?.meta?.title ?? to.meta.title)
    }
    else {
      settingsStore.setTitle(to.meta.title)
    }
  })
}

function setupKeepAlive(router: Router) {
  router.afterEach((to, from) => {
    const keepAliveStore = useKeepAliveStore()

    // 进入新页面：如果 meta.cache 打开，就加入缓存
    if (to.meta.cache) {
      const compName = to.matched.at(-1)?.components?.default.name
      compName && keepAliveStore.add(compName)
    }

    // 离开页面：根据 cache/noCache/ reload 规则移除
    if (from.meta.cache) {
      const compName = from.matched.at(-1)?.components?.default.name
      if (compName) {
        // 根据 from.meta.cache 类型判断是否移除
        if (typeof from.meta.cache === 'string') {
          from.meta.cache !== to.name && keepAliveStore.remove(compName)
        } else if (Array.isArray(from.meta.cache)) {
          !from.meta.cache.includes(to.name as string) && keepAliveStore.remove(compName)
        }
        // noCache 强制移除
        if (from.meta.noCache) {
          if (typeof from.meta.noCache === 'string' && from.meta.noCache === to.name) {
            keepAliveStore.remove(compName)
          } else if (Array.isArray(from.meta.noCache) && from.meta.noCache.includes(to.name as string)) {
            keepAliveStore.remove(compName)
          }
        }
        // reload 页面也要清缓存
        to.name === 'reload' && keepAliveStore.remove(compName)
      }
    }
  })
}

function setupOther(router: Router) {
  router.afterEach(() => {
    document.documentElement.scrollTop = 0
  })
}
