<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" @click="modalShow=true">新增部门</Button>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="deptTable"
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
          <Button type="primary" size="small">编辑</Button>&nbsp;&nbsp;
          <Button type="error" size="small">删除</Button>
        </template>
      </zk-table>
    </Card>
    <Modal
      :title="modalTitle"
      v-model="modalShow"
      :mask-closable="false"
      @on-visible-change="handleModalVisibleChange"
      @on-ok="handleModalOk">
      <Form ref="deptForm" :model="deptFrom" :label-width="80">
        <FormItem prop="deptName" label="部门名称" required>
          <Input type="text" v-model="deptFrom.deptName" placeholder="部门名称"/>
        </FormItem>
        <FormItem prop="parenId" label="上级部门">
          <Tree ref="tree" :data="deptTree" :multiple="false" children-key="children"></Tree>
        </FormItem>
      </Form>
    </Modal>
  </div>

</template>

<script>
import { getDeptTree,getDeptTable,addDept } from '@/api/sys/dept/dept'
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
      deptTable: [],
      deptFrom: {
        deptName: '',
        parentId: '0',
      },
      columns: [
        {
          label: '部门',
          prop: 'deptName',
        },
        {
          label: '创建时间',
          prop: 'createTime',
        },
        {
          label: '操作',
          prop: 'id',
          type: 'template',
          template: 'id'
        }
      ]
    }
  },
  methods: {
    handleModalVisibleChange: function (event) {

    },
    handleModalOk: function () {
      if(this.$refs['tree'].getSelectedNodes()[0]){
        this.deptFrom.parentId = this.$refs['tree'].getSelectedNodes()[0].id
      }
      console.log(this.deptFrom)
      addDept(this.deptFrom)
    },
    copyObj: function (obj) {
      for(let child of obj){
        if(child.children.length > 0){
          this.copyObj(child.children)
        }else{
          for(let key in child.obj){
            child[key] = child.obj[key]
          }
        }
      }
    }
  },
  mounted () {
    getDeptTree().then(res => {
      this.deptTree = res.data
    })
    let self = this
    getDeptTable().then(res => {
      this.deptTable = res.data
      this.deptTable.forEach(item => {
        for(let key in item.obj){
          item[key] = item.obj[key]
        }
        self.copyObj(item.children)
        // for(let child of item.children){
        //   console.log(child)
        //   for(let key in child.obj){
        //     child[key] = child.obj[key]
        //   }
        // }
      })
      console.log(this.deptTable)
    })
  }
}
</script>

<style scoped>

</style>
