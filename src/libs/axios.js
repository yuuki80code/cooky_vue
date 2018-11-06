import Axios from 'axios'
import baseURL from '_conf/url'
import { Message } from 'iview'
import {getToken,setToken} from "./util"
import {refreshToken} from "@/api/login/login";

class httpRequest {
  constructor () {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }
  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors (instance, url) {
    // 添加请求拦截器
    instance.interceptors.request.use(config => {
      if (!config.url.includes('/login')) {
        config.headers['Authorization'] = getToken()
      }
      // Spin.show()
      // 在发送请求之前做些什么
      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      let { data } = res
      console.log(res)
      const is = this.destroy(url)
      if (!is) {
        setTimeout(() => {
          // Spin.hide()
        }, 500)
      }
      if (data.code !== 200) {
          if (data.code === 403) {
          // token 过期
          if(data.msg === 'Token expire') {
            //尝试刷新token
            refreshToken(getToken()).then(res => {
              if(res.code===200){
                setToken(res.data)
                Message.success('尝试刷新token成功，刷新页面...')
                setInterval(() => {
                  window.location.reload()
                },1000)
                // return data
              }else {
                Message.error('尝试刷新token失败,请重新登录')
                setInterval(()=>{
                  window.location.href = '/login'
                  sessionStorage.clear()  //清除token避免路由跳转死循环
                },2000)
              }
            }).catch(e =>{
              Message.error('未登录，或登录失效，请登录')
              setInterval(()=>{
                window.location.href = '/login'
                sessionStorage.clear()  //清除token避免路由跳转死循环
              },2000)
            })
          }
        } else {
          if (data.msg) Message.error(data.msg)
        }
        return false
      }
      return data
    }, (error) => {
      Message.error('服务内部错误')
      // 对响应错误做点什么
      return Promise.reject(error)
    })
  }
  // 创建实例
  create () {
    let conf = {
      baseURL: baseURL,
      // timeout: 2000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-URL-PATH': location.pathname,
        'crossDomain':true,
      }
    }
    return Axios.create(conf)
  }
  // 合并请求实例
  mergeReqest (instances = []) {
    //
  }
  // 请求实例
  request (options) {
    var instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}
export default httpRequest
