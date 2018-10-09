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

export const editDept = (dept) => {
  const data = new URLSearchParams()
  for(let key in dept){
    data.append(key,dept[key])
  }
  return axios.request({
    url: '/dept/edit',
    data,
    method: 'post'
  })
}

export const deleteDept = id => {
  const data = new URLSearchParams()
  data.append("id",id)
  return axios.request({
    url: '/dept/delete',
    data,
    method: 'post'
  })
}
