import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'

export const getTableData = req => {
  let tableData = []
  doCustomTimes(5, () => {
    tableData.push(Mock.mock({
      name: '@name',
      email: '@email',
      dept: '@dept',
      phone: '@phone',
      sex: '@sex',
      status: '@status',
      createTime: '@date'
    }))
  })
  return {
    code: 200,
    data: tableData,
    msg: ''
  }
}
