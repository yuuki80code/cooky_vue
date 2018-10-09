import axios from '@/libs/api.request'

export const getMenu = () => {
  return axios.request({
    url: '/menu/list',
    method: 'get'
  })
}

export const editMenu = (menu) => {
  const data = new URLSearchParams()
  for (let key in menu) {
    data.append(key,menu[key])
  }
  return axios.request({
    url: '/menu/edit',
    data,
    method: 'post'
  })
}

export const deleteMenu = (id) => {
  const data = new URLSearchParams()
  data.append("id",id)
  return axios.request({
    url: '/menu/delete',
    data,
    method: 'post',
  })
}
