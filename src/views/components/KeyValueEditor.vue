<template>
  <div class="key-value">
    <a-row type="flex" class="table-row table-header">
      <a-col class="th action" v-if="!readOnly">
        <a-button size="small" type="primary" @click="() => {showImportDialog=true; importData=''}">导入</a-button>
        <!--        <a-switch checked-children="json" un-checked-children="json" size="small" v-model="isJson" @change="changeEditor" />-->
        <a-icon style="float:right; margin-top: 5px" v-if="!isJson" type="plus-circle" @click="addItem" title="添加"/>
      </a-col>
      <a-col class="th key" v-if="!isJson">键Key</a-col>
      <a-col class="th value" v-if="!isJson">值Value</a-col>
      <a-col class="th required" v-if="!isJson && !onlyKeyValue">必须</a-col>
      <a-col class="th desc" v-if="!isJson && !onlyKeyValue">描述</a-col>
      <a-col v-if="isJson" class="th" style="flex: 1"></a-col>
    </a-row>
    <draggable
      v-if="!isJson"
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
        <a-col class="td action" v-if="!readOnly"><a-icon v-show="helperValue[index].handle" type="menu" class="handle"></a-icon><a-icon type="delete" @click="removeItem(index)"/></a-col>
        <a-col class="td key">
          <span v-if="readOnly">{{ item.key }}</span>
          <template v-else>
            <template v-if="keySource.length">
              <a-auto-complete
                v-model="item.key"
                :filter-option="filterOption"
                :data-source="keySource"
                style="width: 100%"/>
            </template>
            <template v-else>
              <a-input v-model="item.key" />
            </template>
          </template>
        </a-col>
        <a-col class="td value"> <span v-if="readOnly">{{ item.value }}</span> <a-input v-else v-model="item.value" /></a-col>
        <a-col class="td required" v-if="!onlyKeyValue"> <span v-if="readOnly">{{ item.required ? '是' : '否' }}</span> <a-checkbox v-else v-model="item.required"></a-checkbox></a-col>
        <a-col class="td desc" v-if="!onlyKeyValue"> <span v-if="readOnly">{{ item.desc }}</span> <a-input v-else v-model="item.desc" /></a-col>
      </a-row>
    </draggable>
    <!--    <json-editor v-if="isJson" ref="editor" :value="editorValue" style="height: 200px;border-right: 1px solid #eee;border-bottom: 1px solid #eee"></json-editor>-->
    <a-modal
      title="批量导入参数 (支持json格式)"
      :visible="showImportDialog"
      :width="500"
      @ok="exportOk"
      @cancel="exportCancel"
    >
      <a-textarea :rows="6" v-model="importData" placeholder="key:value (每行一个)"></a-textarea>
    </a-modal>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { AutoComplete } from 'ant-design-vue'
  // import JsonEditor from '@/views/components/editor/JsonEditor'
  import json5 from 'json5'
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
      // JsonEditor,
      draggable,
      'AAutoComplete': AutoComplete
    },
    props: {
      value: {
        type: Array,
        default: () => []
      },
      keySource: {
        type: Array,
        default: () => []
      },
      onlyKeyValue: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: [ this.getDefaultValue() ],
        helperValue: [{ ...defaultHelper }],
        dragging: false,
        isJson: false,
        editorValue: '',
        showImportDialog: false,
        importData: ''
      }
    },
    watch: {
      currentValue: {
        handler: function (val) {
          this.$emit('input', val)
        },
        deep: true
      },
      value (val) {
        this.setValue(val)
      }
    },
    methods: {
      getDefaultValue () {
        if (this.onlyKeyValue) {
          return { key: defaultValue.key, value: defaultValue.value }
        } else {
          return { ...defaultValue }
        }
      },
      setValue (val) {
        if (Array.isArray(val) && val.length) {
          this.currentValue = val
          this.helperValue = val.map(() => {
            return { ...defaultHelper }
          })
        }
      },
      clear () {
        this.currentValue = [this.getDefaultValue()]
        this.helperValue = [{ ...defaultHelper }]
      },
      addItem () {
        this.currentValue.push(this.getDefaultValue())
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
        this.$nextTick(() => {
          this.$set(this.helperValue, evt.newIndex, { handle: true })
        })
        setTimeout(() => {
          this.dragging = false
        }, 0)
      },
      /*
      changeEditor () {
        if (this.isJson) {
          if (this.onlyKeyValue) {
            this.editorValue = JSON.stringify(this.currentValue.map((item) => { return { key: item.key, value: item.value } }), null, 2)
          } else {
            this.editorValue = JSON.stringify(this.currentValue, null, 2)
          }
        } else {
          try {
            const value = json5.parse(this.$refs.editor.getValue())
            if (Array.isArray(value)) {
              this.currentValue = json5.parse(this.$refs.editor.getValue())
            } else {
              this.$message.error('JSON格式错误，必需为数组')
            }
          } catch (e) {
            this.$message.error('JSON格式错误')
          }
        }
      },
      */
      exportOk () {
        if (this.importData.trim() === '') {
          this.showImportDialog = false
          return
        }

        let resArr = []

        try {
          const importData = json5.parse(this.importData)
          for (const [key, value] of Object.entries(importData)) {
            resArr.push({ key, value })
          }
        } catch (e) {
          const importData = this.importData.replace(/\n(\n)*( )*(\n)*\n/g, '\n').replace(/(\r\n)|(\n)/g, ',').replace(/,+$/, '')
          const inputArr = importData.split(',')
          resArr = inputArr.map((item) => {
            const splitArr = item.split(':')
            return { key: splitArr[0], value: splitArr[1] || '' }
          })
        }

        if (resArr.length) {
          this.currentValue = this.currentValue.concat(resArr)
        }
        this.showImportDialog = false
      },
      exportCancel () {
        this.showImportDialog = false
      }
    },
    mounted () {
      this.setValue(this.value)
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
        background: hsl(54, 100%, 97%);
        &:last-child {
          border-right: 1px solid #eee;
        }
        clear: both;
      }
      .td{
        line-height: 30px;

        span{
          margin-left: 10px;
        }

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
        width: 95px;
        .handle{
          margin-right: 25px;
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
        span{
          margin: 0;
        }
      }
      .desc{
        flex: 1;
      }
    }
  }
</style>
