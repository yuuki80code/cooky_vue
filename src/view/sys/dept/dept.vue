<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="modalShow=true">新增部门</Button>
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
        <template slot="id" scope="scope">
          <Button type="primary" size="small" @click="handleEdit(scope.row)">编辑</Button>&nbsp;&nbsp;
          <Button type="error" size="small" @click="handleDelete(scope.row)">删除</Button>
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
import { getDeptTree,deleteDept,editDept } from '@/api/sys/dept/dept'
import { selectDept } from "@/libs/tools";

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
      modalTitle: '新增部门',
      modalShow: false,
      deptTree: [],
      deptTreeClone: [],
     // deptTable: [],
      deptForm: {
        deptId: -1,
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
          prop: 'extraData',
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
  methods: {
    handleModalVisibleChange: function (event) {
      event? '' : this.reset()
    },
    handleModalOk: function () {
      if(this.$refs['tree'].getSelectedNodes()[0]){
        this.deptForm.parentId = this.$refs['tree'].getSelectedNodes()[0].id
      }
      console.log(this.deptForm)
      editDept(this.deptForm).then(res => {
        this.$Message.success(res.msg)
        this._getDeptTree()
      })
    },
    handleEdit: function(row) {
      //console.log(row)
      this.deptTree = selectDept(this.deptTree,row.id)
      this.deptForm.deptId = row.id
      this.deptForm.deptName = row.title
      this.deptForm.parentId = row.parentId
      this.modalShow = true
    },
    handleDelete: function (row) {
      deleteDept(row.id).then(res => {
        this.$Message.success(res.msg)
        this._getDeptTree()
      })
    },
    reset: function() {
      this.deptForm =  {
        deptId: -1,
        deptName: '',
        parentId: '0',
      }
      this.deptTree = this.deptTreeClone
    },
    _getDeptTree: function () {
      getDeptTree().then(res => {
        this.deptTree = res.data
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
