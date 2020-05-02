<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-input v-model="queryParam.keywords" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a-button style="margin-left: 8px" @click="createOrUpdate">创建</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      bordered
      showPagination="auto"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="method" slot-scope="text">
        <a-tag style="width:70px" :color="methodTagColor(text)">{{ methodToString(text) }}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button-group size="small">
          <a-button @click="view(record, text)"><a-icon type="eye" /></a-button>
          <a-button @click="createOrUpdate(record)"><a-icon type="edit" /></a-button>
          <a-button><a-icon type="link" /></a-button>
        </a-button-group>
        <a-button style="margin-left:5px" size="small"><a-icon type="more" /></a-button>
      </span>
    </s-table>
    <a-drawer
      wrapClassName="mock-draw"
      title="Basic Drawer"
      placement="right"
      :closable="true"
      :width="drawer.width"
      @close="onDrawClose"
      :maskClosable="true"
      :visible="drawer.show"
    >
      <div class="mock-editor-wrap">
        <div class="mock-form">
          <a-form-model layout="vertical" :model="mockForm" ref="mockForm" :rules="rules" @submit="submit">
            <a-form-model-item label="URL" prop="url">
              <a-input v-model="mockForm.url" placeholder="please input url" />
            </a-form-model-item>
            <a-row :gutter="20">
              <a-col :span="12">
                <a-form-model-item label="Method">
                  <a-select v-model="mockForm.method">
                    <a-select-option value="get">
                      get
                    </a-select-option>
                    <a-select-option value="post">
                      post
                    </a-select-option>
                    <a-select-option value="put">
                      put
                    </a-select-option>
                    <a-select-option value="delete">
                      delete
                    </a-select-option>
                    <a-select-option value="patch">
                      patch
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Timeout" prop="delay">
                  <a-input-number v-model="mockForm.delay" :min="0" :precision="0" :step="100" style="width: 100%"/>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-form-model-item label="Description" prop="description">
              <a-input v-model="mockForm.description" placeholder="please input description" />
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" block htmlType="submit">
                Submit
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="mock-editor">
          <div ref="editor"></div>
        </div>
      </div>
    </a-drawer>
  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import ApiMock from '@/api/mock'
  import { Method, MethodTagColor } from '@/utils/enum'
  import jsBeautify from 'js-beautify/js/lib/beautify'
  const ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/monokai')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  require('./snippets')

  const mockForm = {
    id: '',
    url: '',
    method: 'get',
    delay: 0,
    description: '',
    rule: '{}'
  }

  export default {
    name: 'Mock',
    components: {
      STable
    },
    data () {
      return {
        queryParam: {},
        project: null,
        baseURL: '',
        columns: [
          {
            title: 'Method',
            dataIndex: 'method',
            width: 100,
            align: 'center',
            filters: [
              { text: 'get', value: 1 },
              { text: 'post', value: 2 },
              { text: 'put', value: 3 },
              { text: 'delete', value: 4 },
              { text: 'patch', value: 5 }
            ],
            scopedSlots: { customRender: 'method' }
          },
          {
            title: 'URL',
            dataIndex: 'url',
            width: 400
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 150,
            scopedSlots: { customRender: 'action' }
          }
        ],
        loadData: async parameter => {
          const { data } = await ApiMock.list(
            Object.assign(parameter, this.queryParam, { project_sign: this.$route.params.projectSign })
          )
          this.project = data.bean.project
          const { sign, base_url: baseUrl } = data.bean.project
          this.baseURL = `${location.origin}/mock/${sign}${baseUrl}`
          return data.bean
        },
        selectedRowKeys: [],
        selectedRows: [],
        editor: null,
        editorSetup: false,
        drawer: {
          id: '',
          show: false,
          width: document.body.clientWidth - 200
        },
        rules: {
          url: [
            { required: true, message: 'Please input url', trigger: 'blur' }
          ],
          description: [{ required: true, message: 'Please input description', trigger: 'blur' }],
          rule: [{ required: true, message: 'Please input rule', trigger: 'blur' }]
        },
        mockForm
      }
    },
    methods: {
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      view (record) {
        const url = `${this.baseURL}${record.url}#!method=${Method[record.method]}`
        window.open(url)
      },
      createOrUpdate (record) {
        this.drawer.show = true
        if (!this.editorSetup) {
          this.$nextTick(() => {
            this.setEditor()
            this.editorSetup = true
          })
        }
        if (record.id) {
          this.drawer.id = record.id
          this.mockForm = Object.assign(Object.create(null), this.mockForm, record)
          this.mockForm.method = Method[record.method]
        } else {
          this.drawer.id = ''
          this.mockForm = mockForm
          this.mockForm.project_id = this.project.id
        }
        this.$nextTick(() => {
          this.editor.setValue(this.mockForm.rule)
          this.format()
        })
      },
      onDrawClose () {
        this.drawer.show = false
      },
      submit (e) {
        if (e) {
          e.preventDefault()
        }
        this.$refs.mockForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          if (!this.drawer.id) {
            const { data } = await ApiMock.create({ ...this.mockForm })
            const { code, message } = data
            if (code === 200) {
              this.$message.success('创建成功')
              this.drawer.show = false
              this.$refs['table'].refresh()
            } else {
              this.$message.error(message)
            }
          } else {
            const { data } = await ApiMock.update({ ...this.mockForm })
            const { code, message } = data
            if (code === 200) {
              this.$message.success('创建成功')
              this.drawer.show = false
              this.$refs['table'].refresh()
            } else {
              this.$message.error(message)
            }
          }
        })
      },
      onChange () {
        this.mockForm.rule = this.editor.getValue()
      },
      format () {
        const value = this.editor.getValue()
        const code = /^http(s)?/.test(value)
          ? value
          : jsBeautify.js_beautify(value, { indent_size: 2 })
        this.editor.setValue(code)
      },
      setEditor () {
        this.editor = ace.edit(this.$refs.editor)
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setTheme('ace/theme/monokai')
        this.editor.setOption('tabSize', 2)
        this.editor.setOption('fontSize', 15)
        // this.editor.setOption('enableBasicAutocompletion', true)
        this.editor.setOption('enableLiveAutocompletion', true)
        this.editor.setOption('enableSnippets', true)
        this.editor.clearSelection()
        this.editor.getSession().setUseWorker(false)
        this.editor.on('change', this.onChange)
        this.editor.commands.addCommand({
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            this.submit()
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .mock-draw{
    .ant-drawer-header{
      display: none;
    }
    .ant-drawer-wrapper-body{
      display: flex;
      flex-direction: column;
      .ant-drawer-body{
        padding: 10px;
        flex: 1;
      }
    }
  }
  .mock-editor-wrap{
    display: flex;
    height: 100%;
    .mock-form{
      width: 400px;
      display: flex;
      /*justify-content: center;*/
      align-items: center;
      margin-left: 10px;
      margin-right: 20px;
      form{
        flex: 1;
      }
    }

    .mock-editor{
      width: 100%;
      height: 100%;
      .ace_editor{
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
