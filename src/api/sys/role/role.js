import axios from '@/libs/api.request'


export const getRoleList = () => {
  return axios.request({
    url:'/role/list',
    method: 'get'
  })
}

export const editRole = (role) => {
  const data = new URLSearchParams()
  for(let key in role) {
    data.append(key,role[key])
  }
  return axios.request({
    url: '/role/edit',
    data,
    method: 'post'
  })
}

export const getMenus = (id) => {
  return axios.request({
    url: '/role/menus',
    method: 'get',
    params : {
      id: id
    }
  })
}

export const deleteRole = (id) => {
  const data = new URLSearchParams()
  data.append('roleId',id)
  return axios.request({
    url: '/role/delete',
    data,
    method: 'post'

  })
}
