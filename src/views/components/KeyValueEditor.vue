<template>
  <div class="key-value">
    <a-row type="flex" class="table-row table-header">
      <a-col class="th action"><a-icon type="plus" @click="addItem"/></a-col>
      <a-col class="th key">键Key</a-col>
      <a-col class="th value">值Value</a-col>
      <a-col class="th required" v-if="!onlyKeyValue">必选</a-col>
      <!--      <a-col class="th rule">生成规则</a-col>-->
      <a-col class="th desc" v-if="!onlyKeyValue">描述</a-col>
    </a-row>
    <draggable
      v-model="currentValue"
      draggable=".table-row"
      handle=".handle"
      @start="onStart"
      @end="onEnd"
    >
      <a-row
        type="flex"
        class="table-row table-body"
        v-for="(item, index) in currentValue"
        :key="index"
        @mouseover.native="mouseover(helperValue[index])"
        @mouseout.native="mouseout(helperValue[index])">
        <a-col class="td action"><a-icon v-show="helperValue[index].handle" type="menu" class="handle"></a-icon><a-icon type="delete" @click="removeItem(index)"/></a-col>
        <a-col class="td key" v-if="keySource.length"><a-auto-complete
          v-model="item.key"
          :filter-option="filterOption"
          :data-source="keySource"
          style="width: 100%"/></a-col>
        <a-col class="td key" v-else>  <a-input v-model="item.key" /></a-col>
        <a-col class="td value"><a-input v-model="item.value" /></a-col>
        <a-col class="td required" v-if="!onlyKeyValue"><a-checkbox v-model="item.required"></a-checkbox></a-col>
        <!--        <a-col class="td rule"><a-input v-model="item.rule" /></a-col>-->
        <a-col class="td desc" v-if="!onlyKeyValue"><a-input v-model="item.desc" /></a-col>
      </a-row>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { AutoComplete } from 'ant-design-vue'
  const defaultValue = {
    key: '',
    value: '',
    required: false,
    desc: ''
  }

  const defaultHelper = {
    handle: false
  }

  export default {
    name: 'KeyValueEditor',
    components: {
      draggable,
      'AAutoComplete': AutoComplete
    },
    props: {
      name: {
        type: String,
        default: ''
      },
      onlyKeyValue: {
        type: Boolean,
        default: false
      },
      keySource: {
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
        currentValue: [{ ...defaultValue }],
        helperValue: [{ ...defaultHelper }],
        dragging: false,
        Headers
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.setValue(val)
      }
    },
    methods: {
      setValue (val) {
        this.currentValue = val
        this.helperValue = val.map(() => {
          return defaultHelper
        })
      },
      addItem () {
        this.currentValue.push({ ...defaultValue })
        this.helperValue.push({ ...defaultHelper })
      },
      removeItem (index) {
        this.currentValue.splice(index, 1)
        this.helperValue.splice(index, 1)
      },
      filterOption (input, option) {
        return (
          option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
        )
      },
      mouseover (item) {
        if (this.dragging) return
        item.handle = true
      },
      mouseout (item) {
        if (this.dragging) return
        item.handle = false
      },
      onStart () {
        this.dragging = true
      },
      onEnd (evt) {
        this.$set(this.helperValue, evt.newIndex, { handle: true })
        setTimeout(() => {
          this.dragging = false
        }, 0)
      }
    },
    mounted () {
      if (this.value && this.value.length) {
        this.setValue(this.value)
      }
    }
  }
</script>

<style scoped lang="less">
  .key-value{
    .table-row{
      .th,.td{
        box-sizing: border-box;
        vertical-align: middle;
        border-left:1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 3px;
      }
      .th{
        line-height: 22px;
        padding: 5px 10px;
        border-top: 1px solid #eee;
        &:last-child {
          border-right: 1px solid #eee;
        }
      }
      .td{
        line-height: 30px;
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
        .handle{
          margin-right: 20px;
          cursor: ns-resize;
        }
      }
      .key{
        flex: 1;
      }
      .value{
        flex: 1;
      }
      .required{
        width: 60px;
        text-align: center;
      }
      .rule{
        width: 100px;
      }
      .desc{
        flex: 1;
      }
    }
  }
</style>
