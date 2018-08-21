import axios from '@/libs/api.request'


export const getRoleList = () => {
  return axios.request({
    url:'/role/list',
    method: 'get'
  })
}
