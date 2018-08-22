<template>
  <div>
    <Card>
      <Button style="margin: 10px 0;" type="primary" >新增部门</Button>
      <zk-table
        ref="table"
        sum-text="sum"
        index-text="#"
        :data="data"
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
        <template slot="id" scope="id">
          <Button type="primary" size="small">编辑</Button>&nbsp;&nbsp;
          <Button type="warning" size="small">删除</Button>
        </template>
      </zk-table>
    </Card>
  </div>

</template>

<script>
import { getAllDept } from '@/api/sys/dept/dept'
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
      data: [],
      columns: [
        {
          label: '部门',
          prop: 'title'
        },
        {
          label: '创建时间',
          prop: 'extraData'
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

  },
  mounted () {
    getAllDept().then(res => {
      this.data = res.data
    })
  }
}
</script>

<style scoped>

</style>
