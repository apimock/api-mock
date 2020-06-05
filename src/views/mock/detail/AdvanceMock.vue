<template>
  <div class="advance">
    <ExpectDialog v-model="showExpectDialog" :form-data="expectFormData" @update="refresh"></ExpectDialog>
    <a-tabs class="normal-tabs response-tabs" v-model="activeKey" :animated="false">
      <a-tab-pane key="expect">
        <span slot="tab">
          期望
          <a-badge :status="expectStatus"/>
        </span>
        <div class="list" style="padding: 20px">
          <a-button type="primary" @click="openExpectDialog(null)">添加期望</a-button>
          <s-table
            ref="table"
            size="small"
            rowKey="id"
            :columns="columns"
            :data="loadData"
            showPagination="auto"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          >
            <span slot="name" slot-scope="text, record"><a @click="view(record)">{{ text }}</a></span>
            <span slot="params" slot-scope="text, record">
              <a-badge v-if="!text || text ==='[]'" :status="setStatus(record).status" :text="setStatus(record).text"/>
              <a-popover v-else  title="参数匹配" trigger="click">
                <template slot="content">
                  {{serializeParams(text)}}
                </template>
                <a-badge style="cursor: pointer" :status="setStatus(record).status" :text="setStatus(record).text"/>
              </a-popover>
            </span>
            <span slot="status" slot-scope="text" :style="{color:setStatusColor(text)}">
              {{ text }}
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
              <a-switch v-model="record.enable" @change="saveExpect(record)"/>
              <a-button icon="edit" size="small" style="margin:0 10px" @click="openExpectDialog(record)">编辑</a-button>
              <a-popconfirm
                title="你确定要删除该条吗?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="del(record)"
              >
                <a-button icon="delete" size="small">删除</a-button>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="script" class="script-pane">
        <span slot="tab">
          脚本
          <a-badge :status="scriptStatus"/>
        </span>
        <div class="title">
          是否开启：
          <a-switch v-model="mockForm.enable_script" @change="saveScript(false)"/>
        </div>
        <script-editor ref="codeEditor" :value="mockForm.script" @save="saveScript" style="height: 600px"></script-editor>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import ScriptEditor from '@/views/components/editor/ScriptEditor'
  import { mapActions, mapState } from 'vuex'
  import ApiExpect from '@/api/expect'
  import ApiMock from '@/api/mock'
  import ExpectDialog from '@/views/components/ExpectDialog'
  import { STable } from '@/components'
  import { CodeColor } from '@/utils/enum'
  export default {
    name: 'AdvanceMock',
    components: {
      ScriptEditor,
      ExpectDialog,
      STable
    },
    data () {
      return {
        activeKey: 'expect',
        showExpectDialog: false,
        expectFormData: null,
        queryParam: {},
        columns: [
          {
            title: '名称',
            dataIndex: 'name',
            scopedSlots: { customRender: 'name' }
          },
          {
            title: '匹配状态',
            dataIndex: 'params',
            scopedSlots: { customRender: 'params' }
          },
          {
            title: '响应状态码',
            dataIndex: 'status',
            align: 'center',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '延时(ms)',
            dataIndex: 'delay',
            align: 'center'
          },
          {
            title: '创建者',
            dataIndex: 'user',
            align: 'center',
            width: 120,
            scopedSlots: { customRender: 'avatar' }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 250,
            scopedSlots: { customRender: 'action' }
          }
        ],
        loadData: async parameter => {
          const { data } = await ApiExpect.list(
            Object.assign(parameter, this.queryParam, { mock_id: this.mockId })
          )
          let expectStatus = 'default'
          data.bean.data.forEach((item) => {
            item.enable = !!item.enable
            if (expectStatus === 'default') {
              if (item.enable && item.params && item.params !== '[]') {
                expectStatus = 'success'
              }
            }
          })
          this.expectStatus = expectStatus
          return data.bean
        },
        selectedRowKeys: [],
        selectedRows: [],
        expectStatus: 'default'
      }
    },
    computed: {
      ...mapState('mock', ['mockForm', 'mockId', 'project']),
      scriptStatus () {
        if (this.mockForm.script && this.mockForm.enable_script) {
          return 'success'
        } else {
          return 'default'
        }
      }
    },
    methods: {
      ...mapActions('mock', ['getDetail']),
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      setStatusColor (status) {
        const code = parseInt(status / 100) * 100
        return CodeColor[code] || '#000000a6'
      },
      setStatus (record) {
        const status = {
          success: { status: 'success', text: '有匹配' },
          error: { status: 'error', text: '无匹配' }
        }
        if (!record.params || record.params === '[]') {
          return status.error
        } else {
          return status.success
        }
      },
      serializeParams (params) {
        if (!Array.isArray(params)) {
          try {
            params = JSON.parse(params)
          } catch (e) {
            params = []
          }
        }
        const res = params.map((item) => {
          return `${item.key}=${item.value}`
        })
        return res.join('&')
      },
      async saveExpect (record) {
        const { data } = await ApiExpect.update(record)
        const { code, message } = data
        if (code) {
          // this.$message.success('更新成功！')
        } else {
          this.$message.error(message)
        }
        this.refresh()
      },
      async saveScript (verifyContent = true) {
        const mockData = {
          id: this.mockForm.id,
          enable_script: this.mockForm.enable_script === true ? 1 : 0,
          script: this.$refs.codeEditor.getValue()
        }
        if (verifyContent && !/Api\.json/g.test(mockData.script)) {
          this.$message.error(`必须要有 Api.json = `)
          return
        }
        const { data } = await ApiMock.update(mockData)
        const { code, message } = data
        if (code === 200) {
          this.$message.success('更新成功！')
          this.getDetail()
        } else {
          this.$message.error(message)
        }
      },
      refresh () {
        this.$refs.table.refresh(true)
      },
      openExpectDialog (record) {
        if (record) {
          this.expectFormData = record
        } else {
          this.expectFormData = null
        }
        this.showExpectDialog = true
      },
      async del (record) {
        const { data } = await ApiExpect.delete(record)
        const { code, message } = data
        if (code === 200) {
          this.$message.success('删除成功！')
          this.refresh()
        } else {
          this.$message.error(message)
        }
      },
      view (record) {
        const baseUrl = this.project.base_url
        this.baseURL = `${location.origin}/mock/${this.project.id}${baseUrl}`
        const params = this.serializeParams(record.params)
        const url = `${this.baseURL}${this.mockForm.url}?${params}#!method=${this.mockForm.method}`
        window.open(url)
      }
    }
  }
</script>

<style scoped lang="less">
  .advance{
    padding: 20px;

    .script-pane{
      .title{
        background: #f0f2f5;
        border-bottom: 1px solid #ddd;
        padding: 0 10px;
        line-height: 30px;
        font-size: 13px;
      }
    }
  }
</style>
