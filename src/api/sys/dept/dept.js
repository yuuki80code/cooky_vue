import axios from '@/libs/api.request'

export const getAllDept = () => {
  return axios.request({
    url: '/dept/all',
    method: 'get'
  })
}
