import axios from '@/libs/api.request'

export const getUserList = (name,page,pageSize) => {
  //let username = name?name:''
  const data = new URLSearchParams();
  data.append('username',name)
  data.append('page',page)
  data.append('pageSize',pageSize)

  return axios.request({
    url:'/user/list',
    data,
    method: 'post'
  })
}

export const addUser = ( obj ) => {
  const data = new URLSearchParams();
  for(let key in obj){
    data.append(key,obj[key])
  }
  return axios.request({
    url: '/user/add',
    data,
    method: 'post'
  })
}
