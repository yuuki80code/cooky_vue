<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="modalShow=true" v-if="rules.dept_add">新增部门</Button>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="deptTree"
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
        <template slot="id" slot-scope="scope">
          <Button type="primary" size="small" v-if="rules.dept_edit" @click="handleEdit(scope.row)">编辑</Button>&nbsp;&nbsp;
          <Poptip v-show="scope.row.children.length !== 0"
            confirm
            :transfer = "true"
            title="将连带子部门一并删除，确定删除？"
            @on-ok="handleDelete(scope.row)"
            >
            <Button type="error" size="small" v-if="rules.dept_delete">删除</Button>
          </Poptip>
          <Button type="error" size="small" @click="handleDelete(scope.row)" v-show="scope.row.children.length === 0" v-if="rules.dept_delete">删除</Button>
        </template>
      </zk-table>
    </Card>
    <Modal
      :title="modalTitle"
      v-model="modalShow"
      :mask-closable="false"
      @on-visible-change="handleModalVisibleChange"
      @on-ok="handleModalOk">
      <Form ref="deptForm" :model="deptForm" :label-width="80">
        <FormItem prop="deptName" label="部门名称" required>
          <Input type="text" v-model="deptForm.deptName" placeholder="部门名称"/>
        </FormItem>
        <FormItem prop="parenId" label="上级部门">
          <Tree ref="tree" :data="deptTree" :multiple="false" children-key="children"></Tree>
        </FormItem>
      </Form>
    </Modal>
  </div>

</template>

<script>
import { getDeptTree,deleteDept,addDept,updateDept } from '@/api/sys/dept/dept'
import { buildTableTree,treeShow } from "@/libs/tools"
import { mapState } from 'vuex'

export default {
  name: 'dept',
  data () {
    return {
      props: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false
      },
      modalShow: false,
      deptTree: [],
      deptTreeClone: [],
     // deptTable: [],
      deptForm: {
        deptId: 0,
        deptName: '',
        parentId: '0',
      },
      columns: [
        {
          label: '部门',
          prop: 'title',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
        {
          label: '操作',
          prop: 'deptId',
          type: 'template',
          template: 'id'
        }
      ]
    }
  },
  computed :{
    ...mapState({
      rules: state => state.app.rules
    }),
    modalTitle: function () {
      return this.deptForm.deptId === 0 ? '新增部门':'修改部门'
    }
  },
  methods: {
    handleModalVisibleChange: function (event) {
      event? '' : this.reset()
    },
    handleModalOk: function () {
      if(this.$refs['tree'].getSelectedNodes()[0]){
        this.deptForm.parentId = this.$refs['tree'].getSelectedNodes()[0].deptId
      }
      //console.log(this.deptForm)
      if(this.deptForm.deptId===0){
        addDept(this.deptForm).then(res => {
          this.$Message.success(res.msg)
          this._getDeptTree()
        })
      }else {
        updateDept(this.deptForm).then(res => {
          this.$Message.success(res.msg)
          this._getDeptTree()
        })
      }

    },
    handleEdit: function(row) {
      //console.log(row)

      let temp = treeShow(this.deptTreeClone,'deptId',row.deptId,row.parentId)
      this.deptTree = buildTableTree(temp,"deptId","deptName")
      this.deptForm.deptId = row.deptId
      this.deptForm.deptName = row.title
      this.deptForm.parentId = row.parentId
      this.modalShow = true
    },
    handleDelete: function (row) {
      deleteDept(row.deptId).then(res => {
        this.$Message.success(res.msg)
        this._getDeptTree()
      })
    },
    reset: function() {
      this.deptForm =  {
        deptId: 0,
        deptName: '',
        parentId: '0',
      }
      this.deptTree = buildTableTree(this.deptTreeClone,'deptId','deptName')
    },
    _getDeptTree: function () {
      getDeptTree().then(res => {
        this.deptTree = buildTableTree(res.data,'deptId','deptName')
        this.deptTreeClone = res.data
      })
    }
  },
  mounted () {
    this._getDeptTree()
  }
}
</script>

<style scoped>

</style>
