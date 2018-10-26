import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  routeHasExist
} from '@/libs/util'
import { routes, routerMap } from '@/router/routers'//import routers from '@/router/routers'
import deepclone from 'clone-deep'

const state = {
  routerList: routes,
  breadCrumbList: [],
  tagNavList: [],
  homeRoute: getHomeRoute(routes),
  hasGetRules: false,
  rules: []
}
const getters = {
  menuList: (state, getters, rootState) => getMenuByRouter(state.routerList, 'all')
}
const mutations = {
  CONCAT_ROUTES (state, routerList) {
    state.routerList = routerList.concat(routes)
    state.hasGetRules = true
  },
  LOGOUT (state, param) {
    state.hasGetRules = false
    state.routerList=routes
    state.breadCrumbList= []
    state.tagNavList= []
    state.homeRoute=getHomeRoute(routes)
    state.rules= []
  },
  SET_RULES (state, rules) {
    state.rules = rules
  },
  setBreadCrumb(state, routeMetched) {
    state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
  },
  setTagNavList(state, list) {
    if (list) {
      state.tagNavList = [...list]
      setTagNavListInLocalstorage([...list])
    } else state.tagNavList = getTagNavListFromLocalstorage()
  },
  addTag(state, { route, type = 'unshift' }) {
    if (!routeHasExist(state.tagNavList, route)) {
      if (type === 'push') state.tagNavList.push(route)
      else {
        if (route.name === 'home') state.tagNavList.unshift(route)
        else state.tagNavList.splice(1, 0, route)
      }
      setTagNavListInLocalstorage([...state.tagNavList])
    }
  }
}
const getAccesRouterList = (routes, rules) => {
  return routes.filter(item => {
    if (rules[item.name]) {
      if (item.children) item.children = getAccesRouterList(item.children, rules)
      return true
    } else return false
  })
}
const actions = {
  concatRoutes({commit}, rules) {
    //console.log(rules)
    return new Promise((resolve, reject) => {
      try {
        let routerList = []
        // if (Object.entries(rules).every(item => item[1])) {
        //   routerList = routerMap
        // } else {
        let routerMapClone = deepclone(routerMap)
        routerList = getAccesRouterList(routerMapClone, rules.menu)
       // }
        commit('CONCAT_ROUTES', routerList)
        commit('SET_RULES',rules.button)
        resolve(state.routerList)
      } catch (err) {
        reject(err)
      }
    })
  },
  // getUserRoutes({commit}) {
  //   return new Promise((resolve,reject) => {
  //
  //   })
  // }

}
export default {
  state,
  getters,
  mutations,
  actions
}
