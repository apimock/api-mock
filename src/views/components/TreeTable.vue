<template>
  <div class="tree-table">
    <a-row type="flex" class="table-row table-header">
      <a-col class="th action"><a-icon type="plus" /></a-col>
      <a-col class="th name">名称</a-col>
      <a-col class="th value">初始值</a-col>
      <a-col class="th required">必选</a-col>
      <a-col class="th rule">生成规则</a-col>
      <a-col class="th desc">描述</a-col>
    </a-row>
    <a-row type="flex" class="table-row table-body" v-for="(item, index) in dataSource" :key="index">
      <a-col class="td action"></a-col>
      <a-col class="td name">  <a-input v-model="dataSource[index]['name']" /></a-col>
      <a-col class="td value"><a-input v-model="dataSource[index]['value']" /></a-col>
      <a-col class="td required"><a-checkbox v-model="dataSource[index]['required']"></a-checkbox></a-col>
      <a-col class="td rule"><a-input v-model="dataSource[index]['rule']" /></a-col>
      <a-col class="td desc"><a-input v-model="dataSource[index]['desc']" /></a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'TreeTable',
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      dataSource: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style scoped lang="less">
  .tree-table{
    .table-row{
      .th,.td{
        border: 1px solid #eceeef;
        margin-left: -1px;
        margin-top: -1px;
      }
      .th{
        padding: 5px 10px;
      }
      .action{
        width: 80px;
      }
      .name{
        flex: 1;
      }
      .value{
        width: 100px;
      }
      .required{
        width: 60px;
      }
      .rule{
        width: 100px;
      }
      .desc{
        width: 250px;
      }
    }
  }
</style>
