<template>
    <div>
      <Card>
        <Button style="margin: 10px 0;" type="primary" @click="modalShow=true" v-if="rules.menu_add">新增菜单</Button>
        <zk-table
          ref="table"
          sum-text="sum"
          index-text="#"
          :data="menuTree"
          :columns="columns"
          :stripe="props.stripe"
          :border="props.border"
          :show-header="props.showHeader"
          :show-summary="props.showSummary"
          :show-row-hover="props.showRowHover"
          :show-index="props.showIndex"
          :tree-type="props.treeType"
          :is-fold="props.isFold"
          :expand-type="props.expandType"
          :selection-type="props.selectionType">
          <template slot="type" slot-scope="scope">
            <Tag :color="scope.row.type==0?'success':'warning'">{{scope.row.type==0?'菜单':'按钮'}}</Tag>
          </template>
          <template slot="id" slot-scope="scope">
            <Button type="primary" size="small" @click="handleEdit(scope.row)" v-if="rules.menu_edit">编辑</Button>&nbsp;&nbsp;
            <Poptip v-show="scope.row.children.length !== 0"
                    confirm
                    :transfer = "true"
                    title="子菜单将升级成一级菜单，确定删除？"
                    @on-ok="handleDelete(scope.row)"
            >
              <Button type="error" size="small" v-if="rules.menu_delete">删除</Button>
            </Poptip>
            <Button type="error" size="small" @click="handleDelete(scope.row)" v-show="scope.row.children.length === 0" v-if="rules.menu_delete">删除</Button>
          </template>
        </zk-table>
      </Card>
      <Modal
        :title="modalTitle"
        v-model="modalShow"
        :mask-closable="false"
        @on-visible-change="handleModalVisibleChange"
        @on-ok="handleModalOk">
        <Form ref="menuForm" :model="menuForm" :label-width="80">
          <FormItem prop="menuName" label="菜单名称">
            <Input type="text" v-model="menuForm.menuName" placeholder="菜单名称"/>
          </FormItem>
          <FormItem prop="type" label="类型">
            <RadioGroup :value="menuForm.type" v-model="menuForm.type">
              <Radio label="0">菜单</Radio>
              <Radio label="1">按钮</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem prop="url" label="菜单URL" v-show="menuForm.type == 0">
            <Input type="text" v-model="menuForm.url" placeholder="菜单URL"/>
          </FormItem>
          <FormItem prop="perms" label="权限描述">
            <Input type="text" v-model="menuForm.perms" placeholder="权限描述"/>
          </FormItem>
          <FormItem prop="parenId" label="上级菜单">
            <Tree ref="tree" :data="menuTree" :multiple="false" children-key="children"></Tree>
          </FormItem>
        </Form>
      </Modal>
    </div>
</template>

<script>
  import { getMenu,addMenu,updateMenu,deleteMenu } from "@/api/sys/menu/menu"
  import { buildTableTree,treeShow } from "@/libs/tools"
  import { mapState } from 'vuex'

  export default {
      name: "imenu",
      data() {
        return {
          props: {
            stripe: false,
            border: false,
            showHeader: true,
            showSummary: false,
            showRowHover: true,
            showIndex: false,
            treeType: true,
            isFold: false,
            expandType: false,
            selectionType: false
          },
          modalShow: false,
          menuForm: {
            menuId: 0,
            menuName: '',
            type: '0',
            url: '',
            perms: '',
            icon: '',
            parentId: '0',
          },
          menuTree: [],
          menuData: [],
          columns: [
            {
              label: '名称',
              prop: 'menuName',
            },
            {
              label: '类型',
              prop: 'type',
              type: 'template',
              template: 'type'
            },
            {
              label: '地址',
              prop: 'title',
            },
            {
              label: '权限标识',
              prop: 'perms',
            },
            {
              label: '创建时间',
              prop: 'createTime',
            },
            {
              label: '操作',
              //prop: 'deptId',
              type: 'template',
              template: 'id'
            }
          ]
        }
      },
    computed: {
      ...mapState({
        rules: state => state.app.rules
      }),
      modalTitle: function () {
        return this.menuForm.menuId === 0 ? '新增菜单/按钮':'修改菜单/按钮'
      },
    },
      methods: {
        _getMenu: function () {
          getMenu().then(res => {
            this.menuData = res.data
            this.menuTree = buildTableTree(res.data,'menuId','menuName')
            //console.log(this.menuTree)
          })
        },
        handleEdit: function (row) {

          let menus = this.menuData.filter(item => {
            return item.menuId === row.menuId
          })
          this.menuForm = menus[0]
          delete this.menuForm.createTime
          delete this.menuForm.modifyTime
          delete this.menuForm.icon
          let temp = treeShow(this.menuData,'menuId',row.menuId,row.parentId)
          this.menuTree = buildTableTree(temp,'menuId','menuName')
          this.modalShow = true
        },
        handleDelete: function (row) {
          deleteMenu(row.menuId).then(res => {
            this.$Message.success(res.msg)
            this._getMenu()
          })
        },
        handleModalOk: function () {
          if(this.$refs['tree'].getSelectedNodes()[0]){
            this.menuForm.parentId = this.$refs['tree'].getSelectedNodes()[0].menuId
          }
          if(this.menuForm.menuId===0) {
            addMenu(this.menuForm).then(res => {
              this.$Message.success(res.msg)
              this._getMenu()
            })
          }else {
            updateMenu(this.menuForm).then(res => {
              this.$Message.success(res.msg)
              this._getMenu()
            })
          }

          //this.reset()
        },
        handleModalVisibleChange: function (event) {
          event?'':this.reset()
        },
        reset: function () {
          this.menuForm = {
            menuId: 0,
            menuName: '',
            type: '0',
            url: '',
            perms: '',
            icon: '',
            parentId: "0",
          }
          this.menuTree = buildTableTree(this.menuData,'menuId','menuName')
        }
      },
      mounted() {
        this._getMenu()
      }
    }
</script>

<style scoped>

</style>
