import axios from '@/libs/api.request'
import qs from 'qs'
export const getUserList = (name,page,pageSize) => {
  //let username = name?name:''
  const data = new URLSearchParams()
  data.append('username',name)
  data.append('page',page)
  data.append('pageSize',pageSize)

  return axios.request({
    url:'/user/list',
    data,
    method: 'post'
  })
}

export const addUser = ( user ) => {
  const data = new URLSearchParams()
  for(let key in user){
    data.append(key,user[key])
  }
  return axios.request({
    url: '/user/add',
    data,
    method: 'post'
  })
}

export const getUserWithRole = ( userId ) => {
  // var data = new URLSearchParams()
  // for(let key in user){
  //   console.log(key)
  //   data.append(key,user[key])
  // }

  return axios.request({
    url: '/user/userwithrole',
    params: {userId:userId},
    method: 'get'
  })
}

export const updateUser = ( user ) => {
  const data = new URLSearchParams()
  for(let key in user){
    data.append(key,user[key])
  }
  console.log(data)
  return axios.request({
    url: '/user/update',
    data,
    method: 'post'
  })
}

export const deleteUser = ( userId ) => {
  const data = new URLSearchParams()
  data.append('userId',userId)
  return axios.request({
    url: '/user/delete',
    data,
    method: 'post'
  })
}
