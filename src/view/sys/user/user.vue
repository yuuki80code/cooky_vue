<template>
    <div>
      <Card>
        <Button style="margin: 10px 0;" type="primary" @click="modalShow=true" v-if="rules.user_add">新增用户</Button>
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
            <FormItem prop="password" label="密码" required v-show="this.user.userId === 0">
              <Input type="text" v-model="user.password" placeholder="密码" />
            </FormItem>
            <FormItem prop="dept" label="部门">
              <Tree ref="tree" :data="deptTree" :multiple="false" children-key="children"></Tree>
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
import { getUserList, addUser,getUserWithRole,updateUser,deleteUser } from '@/api/sys/user/user'
import { getDeptTree } from '@/api/sys/dept/dept'
import { getRoleList } from '@/api/sys/role/role'
import { buildTableTree,treeShow } from "@/libs/tools"
import { mapState } from 'vuex'

export default {
  name: 'user',
  data () {
    return {
      curr: 1,
      pageSize: 10,
      total: 0,
      modalShow: false,
      user: {
        userId: 0,
        username: '',
        password: '',
        deptId: '0',
        email: '',
        ssex: '',
        roles: [],
        status: true
      },
      deptTree: [],
      backUpDeptList: [],
      roleList: [],
      columns: [
        {title: '用户名', key: 'username'},
        {title: '部门', key: 'deptName'},
        {title: '邮箱', key: 'email'},
        {
          title: '性别',
          key: 'ssex',
          render: (h, params) => {
            return h('span', params.row.ssex === '0' ? '男' : params.row.ssex === '1' ? '女' : '保密')
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
            let btnEdit = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.handleEdit(params.row)
                }
              }
            }, '编辑')
            let btnDel = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.handleDelete(params.row.userId)
                }
              }
            }, '删除')
            if(this.rules.user_edit && this.rules.user_delete) {
              return h('div', [btnEdit,btnDel])
            } else if(this.rules.user_edit && !this.rules.user_delete){
              return h('div', [btnEdit])
            } else if(!this.rules.user_edit && this.rules.user_delete){
              return h('div', [btnDel])
            } else {
              return h('div', [])
            }
          }


        }
      ],
      tableData: []
    }
  },
  computed :{
    ...mapState({
      rules: state => state.app.rules
    }),
    modalTitle: function () {
      return this.user.userId === 0 ? '新增用户':'修改用户'
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
      //console.log(flag)
      !flag?this.reset():null
    },
    handleModalOk: function () {
      if(this.$refs['tree'].getSelectedNodes()[0]){
        this.user.deptId = this.$refs['tree'].getSelectedNodes()[0].deptId
      }
      //console.log(this.login)
      if(this.user.userId===0){
        addUser(this.user).then(res => {
          this.$Message.success('添加成功')
          this._getUserList()
        })
      } else {
        updateUser(this.user).then(res => {

          this.$Message.success('修改成功')
          this._getUserList()
        })
      }
    },
    handleEdit: function(row) {
      getUserWithRole(row.userId).then(res=>{
        for(let key in this.user){
          this.user[key] = res.data[key]
        }
        this.user.status = this.user.status === '1'
        this.deptTree = buildTableTree(treeShow(this.backUpDeptList,'deptId',this.user.deptId,this.getDeptParentId(this.user.deptId),true),'deptId','deptName')
        //this.deptTree = selectDept(this.deptTree,this.login.deptId)
        this.modalShow = true
      })

    },
    handleDelete: function (userId) {
      deleteUser(userId).then(res=> {
        this.$Message.success('删除成功')
        this._getUserList()
      })
    },
    _getUserList: function () {
      getUserList(this.user.username, this.curr, this.pageSize).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      })
    },
    getDeptParentId: function(id) {
      return this.backUpDeptList.filter(item => {
        return item.deptId === id
      })[0].parentId
    },
    reset: function() {
      this.user = {
        userId: '',
          username: '',
          password: '',
          deptId: '0',
          email: '',
          ssex: '',
          roles: [],
          status: true
        }
      this.deptTree = buildTableTree(this.backUpDeptList,"deptId","deptName")
    },
  },
  mounted () {
    this._getUserList()
    getDeptTree().then(res => {
      this.deptTree = buildTableTree(res.data,"deptId","deptName")
      this.backUpDeptList = res.data
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
