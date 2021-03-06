import {login} from '@/api/login/login'
import {setToken,setUserName} from "@/libs/util";

export default {
  state: {
  },
  getters: {

  },
  actions: {
    login({ commit },{ username,password }) {
      return new Promise((resolve, reject) => {
        login({username, password}).then(res => {
          if (res) {
            setToken(res.data.token)
            // commit('SET_USER_NAME',res.data.username)
            setUserName(res.data.username)
            resolve()
          } else {
            reject(new Error('error'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_USER_NAME(state,username) {
      state.username = username
      state.isExistUserName = true
    }
  }
}
