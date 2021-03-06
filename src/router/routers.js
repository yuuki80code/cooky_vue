import Main from '@/view/main'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export const routerMap = [

  {
    path: '/sys',
    name: 'sys',
    component: Main,
    meta: {
      icon: 'md-settings',
      title: '系统管理',
      notCache: true
    },
    children: [
      {
        path: 'sys_user',
        name: 'user',
        meta: {
          icon: '_md-settings',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/sys/user')
      },
      {
        path: 'sys_role',
        name: 'role',
        meta: {
          icon: '_md-settings',
          title: '角色管理',
          notCache: true
        },
        component: () => import('@/view/sys/role')
      },
      {
        path: 'sys_dept',
        name: 'dept',
        meta: {
          icon: '_md-settings',
          title: '部门管理',
          notCache: true
        },
        component: () => import('@/view/sys/dept')
      },
      {
        path: 'sys_menu',
        name: 'menu',
        meta: {
          icon: '_md-settings',
          title: '菜单管理',
          notCache: true
        },
        component: () => import('@/view/sys/menu')
      }
    ]
  },

]
export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          //notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
