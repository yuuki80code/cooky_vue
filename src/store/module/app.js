import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute
} from '@/libs/util'
import { routes, routerMap } from '@/router/routers'//import routers from '@/router/routers'

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
  addTag(state, item, type = 'unshift') {
    if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
      if (type === 'push') state.tagNavList.push(item)
      else state.tagNavList.unshift(item)
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
        routerList = getAccesRouterList(routerMap, rules.menu)
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
