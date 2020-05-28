<template>
  <div class="tree-table">
    <a-row type="flex" class="table-row table-header">
      <a-col class="th action"><a-icon type="plus" @click="addItem"/></a-col>
      <a-col class="th name">名称</a-col>
      <a-col class="th value">值</a-col>
      <a-col class="th required">必选</a-col>
      <!--      <a-col class="th rule">生成规则</a-col>-->
      <a-col class="th desc">描述</a-col>
    </a-row>
    <draggable v-model="currentValue" draggable=".table-row">
      <a-row type="flex" class="table-row table-body" v-for="(item, index) in currentValue" :key="index">
        <a-col class="td action"><a-icon type="delete" @click="removeItem(index)"/></a-col>
        <a-col class="td name" v-if="name === 'headers'"><a-auto-complete
          v-model="item.name"
          :filter-option="filterOption"
          :data-source="Headers"
          style="width: 100%"/></a-col>
        <a-col class="td name" v-else>  <a-input v-model="item.name" /></a-col>
        <a-col class="td value"><a-input v-model="item.value" /></a-col>
        <a-col class="td required"><a-checkbox v-model="item.required"></a-checkbox></a-col>
        <!--        <a-col class="td rule"><a-input v-model="item.rule" /></a-col>-->
        <a-col class="td desc"><a-input v-model="item.desc" /></a-col>
      </a-row>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { Headers } from '@/utils/enum'
  import { AutoComplete } from 'ant-design-vue'

  export default {
    name: 'TreeTable',
    components: {
      draggable,
      'AAutoComplete': AutoComplete
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      columns: {
        type: Array,
        default: () => []
      },
      value: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        currentValue: [],
        Headers
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
      }
    },
    methods: {
      addItem () {
        this.currentValue.push({
          name: '',
          value: '',
          required: false,
          desc: ''
        })
      },
      removeItem (index) {
        this.currentValue.splice(index, 1)
      },
      filterOption (input, option) {
        return (
          option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
        )
      }
    },
    mounted () {
      if (this.value && this.value.length) {
        this.currentValue = this.value
      }
    }
  }
</script>

<style scoped lang="less">
  .tree-table{
    .table-row{
      .th,.td{
        box-sizing: border-box;
        vertical-align: middle;
        border-left:1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 4px 5px;
      }
      .th{
        padding: 5px 10px;
        border-top: 1px solid #eee;
        &:last-child {
          border-right: 1px solid #eee;
        }
      }
      .td{
        &:last-child{
          border-right: 1px solid #eee;
        }
      }
      .td.action{
        text-align: right;
        padding-right: 10px;
        justify-content: flex-end;
        display: flex;
        align-items: center;
      }
      .action{
        width: 80px;
      }
      .name{
        flex: 1;
      }
      .value{
        width: 150px;
      }
      .required{
        width: 60px;
        text-align: center;
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
