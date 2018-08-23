import axios from '@/libs/api.request'

export const getDeptTree = () => {
  return axios.request({
    url: '/dept/tree',
    method: 'get'
  })
}

export const getDeptTable = () => {
  return axios.request({
    url: '/dept/treetable',
    method: 'get'
  })
}

export const addDept = (dept) => {
  const data = new URLSearchParams();
  for(let key in dept){
    data.append(key,dept[key])
  }
  return axios.request({
    url: '/dept/add',
    data,
    method: 'post'
  })
}
