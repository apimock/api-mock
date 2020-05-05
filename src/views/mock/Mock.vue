<template>
  <a-card :bordered="false">
    <div style="margin-bottom: 20px">
      <a-dropdown v-if="project" :trigger="['click']">
        <a class="ant-dropdown-link" @click="onProjectDropdown">
          {{ project.name }} <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item :disabled="true">
            <a-input-search v-model="projectSearch" placeholder="input search text" style="width: 200px" @search="onProjectSearch"/>
            <a-button @click="toProjectList" style="margin-left: 10px" icon="form" ></a-button>
          </a-menu-item>
          <a-menu-item :disabled="true">
            项目列表
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item v-for="(item, index) in projectList" :key="index">
            <router-link :to="{name: 'mock', params: { projectSign: item.sign }}" replace>{{ item.name }}</router-link>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <a-button
        style="margin-left: 20px"
        type="link"
        icon="link"
        v-clipboard:copy="baseURL"
        v-clipboard:success="onCopySuccess"
        v-clipboard:error="onCopyError" >Base URL<span style="color: #dadada; margin: 0 5px">|</span>{{ baseURL }}</a-button>
    </div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item>
              <a-input-search v-model="queryParam.keywords" placeholder="input URL or Description" enter-button @search="$refs.table.refresh(true)" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="plus" style="margin-left: 8px; background: #1890ff; border-color:#1890ff" @click="createOrUpdate">创建接口</a-button>
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
      <span slot="url" slot-scope="text">
        <a
          v-clipboard:copy="text"
          v-clipboard:success="onCopySuccess"
          v-clipboard:error="onCopyError">{{ text }}</a>
      </span>
      <span slot="avatar" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text.username }}
          </template>
          <a-avatar :src="text.avatar" :title="text.username" :size="28" />
        </a-tooltip>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button-group size="small">
          <a-button @click="view(record, text)"><a-icon type="eye" /></a-button>
          <a-button @click="createOrUpdate(record)"><a-icon type="edit" /></a-button>
          <a-button
            v-clipboard:copy="baseURL+record.url"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"><a-icon type="link" /></a-button>
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
              <a-input v-model="mockForm.url" placeholder="please input url">
                <a-select v-model="mockForm.method" slot="addonBefore" style="width: 90px">
                  <a-select-option v-for="(item, index) in MethodArray" :key="index" :value="item.method">
                    <a-tag style="width: 50px; text-align: center" :color="methodTagColor(item.code)">{{item.method}}</a-tag>
                  </a-select-option>
                </a-select>
              </a-input>
            </a-form-model-item>
            <a-form-model-item label="Description" prop="description">
              <a-input v-model="mockForm.description" placeholder="please input description" />
            </a-form-model-item>
            <a-row :gutter="20">
              <a-col :span="12">
                <a-form-model-item label="Response Status">
                  <a-select
                    v-model="mockForm.status"
                    show-search
                    :dropdownMatchSelectWidth="false"
                  >
                    <a-select-option v-for="(item, index) in ResponseStatus" :key="index" :value="item.code">
                      <template v-if="item.code !== 0">
                        <a-tag :color="item.color">{{ item.code }}</a-tag> {{ item.desc }}
                      </template>
                      <a-divider v-if="item.code === 0" style="margin: 4px 0;" />
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="Response Delay" prop="delay">
                  <a-input-number
                    v-model="mockForm.delay"
                    :min="0"
                    :max="180000"
                    :precision="0"
                    :step="100"
                    style="width: 100%"/>
                </a-form-model-item>
              </a-col>
            </a-row>
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
  import ApiProject from '@/api/project'
  import { Method, MethodTagColor, MethodArray, ResponseStatus } from '@/utils/enum'
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
    status: 200,
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
        projectSign: this.$route.params.projectSign,
        project: null,
        projectList: [],
        projectSearch: '',
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
            width: 300,
            scopedSlots: { customRender: 'url' }
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '创建者',
            dataIndex: 'user',
            align: 'center',
            width: 66,
            scopedSlots: { customRender: 'avatar' }
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
            Object.assign(parameter, this.queryParam, { project_sign: this.projectSign })
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
        mockForm,
        MethodArray,
        ResponseStatus
      }
    },
    methods: {
      async getProjectList (params) {
        const { data } = await ApiProject.list(params)
        const { bean, code } = data
        if (code === 200) {
          this.projectList = bean
        }
      },
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
      },
      onProjectDropdown (e) {
        e.preventDefault()
        this.projectSearch = ''
        this.getProjectList()
      },
      onProjectSearch (value) {
        this.getProjectList({ keywords: value })
      },
      toProjectList () {
        this.$router.push({ name: 'project' })
      },
      onCopySuccess: function (e) {
        this.$message.success('You just copied: ' + e.text)
      },
      onCopyError: function (e) {
        this.$message.error('Failed to copy texts')
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.projectSign = to.params.projectSign
      this.$refs.table.refresh(true)
      next()
    },
    created () {
      this.getProjectList()
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
      width: 450px;
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
