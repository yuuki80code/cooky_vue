<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="modalShow=true">新增角色</Button>
      <Table border :columns="roleColum" :data="roleList"></Table>
    </Card>
    <Modal
      :title="modalTitle"
      v-model="modalShow"
      :mask-closable="false"
      @on-visible-change="handleModalVisibleChange"
      @on-ok="handleModalOk">
      <Form ref="deptForm" :model="roleForm" :label-width="80">
        <FormItem prop="roleName" label="角色名称">
          <Input type="text" v-model="roleForm.roleName" placeholder="角色名称"/>
        </FormItem>
        <FormItem prop="remark" label="角色描述">
          <Input type="text" v-model="roleForm.remark" placeholder="角色描述"/>
        </FormItem>
        <FormItem prop="parenId" label="菜单权限">
          <Tree ref="tree" :data="menuTree" :multiple="true" children-key="children"></Tree>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { getRoleList,editRole,getMenus,deleteRole } from '@/api/sys/role/role'
  import { getMenu } from '@/api/sys/menu/menu'
  import { buildTableTree } from "@/libs/tools"
  import deepclone from 'clone-deep'

  export default {
    name: "role",
    data() {
      return {
        roleColum: [
          {
            title: '角色',
            key: 'roleName'
          },
          {
            title: '描述',
            key: 'remark'
          },
          {
            title: '创建时间',
            key: 'createTime'
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
                      this.handleEdit(params.row)
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
                      this.handleDelete(params.row)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        roleList: [],
        modalShow: false,
        modalTitle: '新增角色',
        menuTree: [],
        backupMenuTree: [],
        roleForm: {
          roleId: 0,
          roleName: '',
          remark: '',
          menuIds: []
        }
      }
    },
    methods: {
      _getRole: function () {
        getRoleList().then(res => {
          this.roleList = res.data
        })
      },
      _getMenuTree: function () {
        getMenu().then(res => {
          this.backupMenuTree = res.data
          this.menuTree = buildTableTree(this.backupMenuTree, 'menuId', 'menuName')
        })
      },
      handleEdit: function(row) {
        this.roleForm.roleId = row.roleId
        this.roleForm.roleName = row.roleName
        this.roleForm.remark = row.remark
        getMenus(row.roleId).then(res => {
          //this.roleForm.menuIds = res.data
          let tempTree = deepclone(this.backupMenuTree)
          tempTree.map(item => {
            if(res.data.indexOf(item.menuId)>-1){
              item.selected = true
            }
            return item
          })
          this.menuTree = buildTableTree(tempTree, 'menuId', 'menuName')
          //console.log(this.menuTree)
          this.modalShow = true
        })
      },
      handleDelete: function (row) {
        deleteRole(row.roleId).then(res => {
          this.$Message.success(res.msg)
          this._getRole()
        })
      },
      handleModalVisibleChange: function (event) {
        event? '' : this.reset()
      },
      handleModalOk: function () {
        const self = this
        let checkNodes = this.$refs['tree'].getSelectedNodes()
        checkNodes.forEach(node => {
          self.roleForm.menuIds.push(node.menuId)
        })
        console.log(this.roleForm)
        editRole(this.roleForm).then(res => {
          this.$Message.success(res.msg)
          this.reset()
          this._getRole()
        })
      },
      reset: function () {
        this.roleForm = {
          roleId: 0,
          roleName: '',
          remark: '',
          menuIds: []
        }
        this.menuTree = buildTableTree(this.backupMenuTree, 'menuId', 'menuName')
      }
    },
    mounted() {
      this._getRole()
      this._getMenuTree()
    }
  }
</script>

<style scoped>

</style>
