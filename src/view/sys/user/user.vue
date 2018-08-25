<template>
    <div>
      <Card>
        <Button style="margin: 10px 0;" type="primary" @click="modalShow=true">新增用户</Button>
        <Table border :columns="columns" :data="tableData"></Table>
        <Page class="page" :total="total" :current="curr" :page-size="pageSize" show-sizer :on-change="onPageChange" :on-page-size-change="onPageSizeChange" />
      </Card>
      <Modal
        :title="modalTitle"
        v-model="modalShow"
        :mask-closable="false"
        @on-visible-change="handleModalVisibleChange"
        @on-ok="handleModalOk">
        <div>
          <Form ref="userForm" :model="user" :label-width="80">
            <FormItem prop="username" label="用户名" required>
              <Input type="text" v-model="user.username" placeholder="用户名"/>
            </FormItem>
            <FormItem prop="password" label="密码" required>
              <Input type="text" v-model="user.password" placeholder="密码" />
            </FormItem>
            <FormItem prop="dept" label="部门">
              <Tree ref="tree" :data="deptList" :multiple="false" children-key="children"></Tree>
            </FormItem>
            <FormItem prop="email" label="邮箱">
              <Input type="text" v-model="user.email" placeholder="邮箱" />
            </FormItem>
            <FormItem prop="sex" label="性别">
              <RadioGroup v-model="user.ssex">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
                <Radio label="2">保密</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem prop="role" label="角色">
              <Select v-model="user.roles" multiple>
                <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
              </Select>
            </FormItem>
            <FormItem prop="status" label="状态">
              <i-switch v-model="user.status" size="large">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
</template>

<script>
import { getUserList, addUser,getUserWithRole } from '@/api/sys/user/user'
import { getDeptTree } from '@/api/sys/dept/dept'
import { getRoleList } from '@/api/sys/role/role'

export default {
  name: 'user',
  data () {
    return {
      curr: 1,
      pageSize: 10,
      total: 0,
      modalTitle: '新增用户',
      modalShow: false,
      user: {
        userId: '',
        username: '',
        password: '',
        deptId: '0',
        email: '',
        ssex: '',
        roles: [],
        status: true
      },
      deptList: [],
      roleList: [],
      columns: [
        {title: '用户名', key: 'username'},
        {title: '部门', key: 'deptName'},
        {title: '邮箱', key: 'email'},
        {title: '手机', key: 'mobile'},
        {
          title: '性别',
          key: 'ssex',
          render: (h, params) => {
            return h('span', params.row.ssex === '1' ? '男' : params.row.ssex === '2' ? '女' : '保密')
          }
        },
        {title: '创建时间', key: 'crateTime'},
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            return h('span', params.row.status === '0' ? '锁定' : '正常')
          }
        },
        {
          title: '操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    getUserWithRole(params.row.userId).then(res=>{
                      this.user = res.data
                      this.user.status = this.user.status === '1'
                      this.selectDept(this.deptList,this.user.deptId)
                      console.log(this.deptList)
                      this.modalShow = true
                    })

                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    console.log(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    onPageChange: function (curr) {
      this.curr = curr
      this._getUserList()
    },
    onPageSizeChange: function (pageSize) {
      this.pageSize = pageSize
      this._getUserList()
    },
    handleModalVisibleChange: function (flag) {

    },
    handleModalOk: function () {
      if(this.$refs['tree'].getSelectedNodes()[0]){
        this.user.deptId = this.$refs['tree'].getSelectedNodes()[0].id
      }
      console.log(this.user)
      addUser(this.user)
    },
    _getUserList: function () {
      getUserList(this.user.username, this.curr, this.pageSize).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    selectDept: function (obj,id) {
      // for(var child of obj)
      //   if(child.id === id){
      //     console.log(id)
      //     if(child.children.length > 0){
      //       console.log('sss')
      //       child.expand = true
      //     }
      //     child.checked = true
      //   }
      //   if(child.children.length > 0){
      //     this.selectDept(child.children,id)
      //   }
      let idStr = `"id":${id}`
      let str = JSON.stringify(obj);
      let index = str.indexOf(idStr);  /**找出idStr字符串的下标*/
      let reg = new RegExp(idStr);
      /**其后插入selected属性，选中该节点*/
      let news = str.replace(reg, idStr + ',\"expand\": true,\"selected\":true');
      console.log(news)
      this.deptList = JSON.parse(news);
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    this._getUserList()
    getDeptTree().then(res => {
      this.deptList = res.data
    })
    getRoleList().then(res => {
      this.roleList = res.data
    })
  }
}
</script>

<style scoped>
.page{
  margin-top: 10px;
  text-align: center;
}
</style>
