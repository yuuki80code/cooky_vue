import Vue from 'vue'
import Router from 'vue-router'
import {routes, routerMap} from './routers'
import store from '@/store'
import iView from 'iview'
import {getToken, setToken, canTurnTo} from '@/libs/util'

Vue.use(Router)
const r = routerMap.concat(routes)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // const token = getToken()
  // if (!token && to.name !== LOGIN_PAGE_NAME) {
  //   // 未登录且要跳转的页面不是登录页
  //   next({
  //     name: LOGIN_PAGE_NAME // 跳转到登录页
  //   })
  // } else if (!token && to.name === LOGIN_PAGE_NAME) {
  //   // 未登陆且要跳转的页面是登录页
  //   next() // 跳转
  // } else if (token && to.name === LOGIN_PAGE_NAME) {
  //   // 已登录且要跳转的页面是登录页
  //   next({
  //     name: 'home' // 跳转到home页
  //   })
  // } else {
  //   store.dispatch('getUserInfo').then(login => {
  //     // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
  //     if (canTurnTo(to.name, login.access, routes)) next() // 有权限，可访问
  //     else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
  //   })
  // }
  const token = getToken()
  if (token) {
    // store.dispatch('authorization', token).then(() => {
    //   if (to.name === 'login') next({ name: 'home' })
    //   else next()
    // }).catch(() => {
    //   setToken('')
    //   next({ name: 'login' })
    // })
    if (!store.state.app.hasGetRules) {
      console.log('路由重载了！----1')
      //store.dispatch('authorization').then(rules => {
      const rules = {
        _home: true,
        home: true,
        doc: true,
        sys: true,
        sys_user: true,
        sys_role: true,
        sys_dept: true,
      }
      store.dispatch('concatRoutes', rules).then(routers => {
        console.log('路由重载了！----2')
        router.addRoutes(routers)
        console.log(routers)
        next({...to, replace: true})
      }).catch(() => {
        next({name: 'login'})
      })
      // })
    } else {
      next()
    }
  } else {
    if (to.name === 'login') next()
    else next({name: 'login'})
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
