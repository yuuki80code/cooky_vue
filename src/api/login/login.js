import axios from '@/libs/api.request'

export const login = ({username,password}) => {
  const data = new URLSearchParams()
  data.append('username',username)
  data.append('password',password)
  return axios.request({
    url: '/login',
    data,
    method: 'post'
  })
}

export const getUserMenu = () => {
  return axios.request({
    url: '/menu/usermenu',
    method: 'post'
  })
}
