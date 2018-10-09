import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
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
    path: '/',
    name: '_home',
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
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book'
    }
  },
  {
    path: '/sys',
    name: 'sys',
    component: Main,
    meta: {
      icon: 'md-settings',
      title: '系统管理'
    },
    children: [
      {
        path: 'sys_user',
        name: 'sys_user',
        meta: {
          icon: '_md-settings',
          title: '用户管理'
        },
        component: () => import('@/view/sys/user')
      },
      {
        path: 'sys_role',
        name: 'sys_role',
        meta: {
          icon: '_md-settings',
          title: '角色管理'
        },
        component: () => import('@/view/sys/role')
      },
      {
        path: 'sys_dept',
        name: 'sys_dept',
        meta: {
          icon: '_md-settings',
          title: '部门管理'
        },
        component: () => import('@/view/sys/dept')
      },
      {
        path: 'sys_menu',
        name: 'sys_menu',
        meta: {
          icon: '_md-settings',
          title: '菜单管理'
        },
        component: () => import('@/view/sys/menu')
      }
    ]
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
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
