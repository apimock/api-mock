<template>
  <div class="advance">
    <ExpectDialog v-model="showExpectDialog"></ExpectDialog>
    <a-tabs class="normal-tabs response-tabs" v-model="activeKey" :animated="false">
      <a-tab-pane key="expect" tab="期望">
        <div class="list" style="padding: 20px">
          <s-table
            ref="table"
            size="small"
            rowKey="id"
            :columns="columns"
            :data="loadData"
            showPagination="auto"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          >
            <span slot="name" slot-scope="text"><a>{{text}}</a></span>
            <span slot="params" slot-scope="text, record">
            <a-badge :status="setStatus(record).status" :text="setStatus(record).text"/>
          </span>
            <span slot="avatar" slot-scope="text">
            <a-tooltip>
              <template slot="title">
                {{ text.username }}
              </template>
              <a-avatar :src="text.avatar" :title="text.username" :size="28" />
            </a-tooltip>
          </span>
            <span slot="action">
            <a-switch default-checked />
            <a-button icon="edit" size="small" style="margin:0 10px">编辑</a-button>
            <a-button icon="delete" size="small">删除</a-button>
          </span>
          </s-table>
        </div>
      </a-tab-pane>
      <a-tab-pane key="script" tab="脚本">
        <a-switch v-model="mockForm.enable_script" @change="saveScript"/>
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
            align: 'center'
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
          return data.bean
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    computed: {
      ...mapState('mock', ['mockForm', 'mockId'])
    },
    methods: {
      ...mapActions('mock', ['getDetail']),
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      setStatus (record) {
        const status = {
          success: { status: 'success', text: '正常' },
          error: { status: 'error', text: '无匹配' }
        }
        if (!record.params) {
          return status.error
        } else {
          return status.success
        }
      },
      async saveScript () {
        const mockData = {
          id: this.mockForm.id,
          enable_script: this.mockForm.enable_script === true ? 1 : 0,
          script: this.$refs.codeEditor.getValue()
        }
        if (!/Api\.json/g.test(mockData.script)) {
          this.$message.error(`必须要有 Api.json = `)
          return
        }
        const { data } = await ApiMock.update(mockData)
        const { code, message } = data
        if (code === 200) {
          this.$message.success('更新成功')
          this.getDetail()
        } else {
          this.$message.error(message)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .advance{
    padding: 20px;
  }
</style>
