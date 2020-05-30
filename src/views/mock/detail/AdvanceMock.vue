<template>
  <div class="advance">
    <ExpectDialog v-model="showExpectDialog"></ExpectDialog>
    <a-tabs class="normal-tabs response-tabs" v-model="activeKey" :animated="false">
      <a-tab-pane key="expect" tab="期望">
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
        </s-table>
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
            dataIndex: 'name'
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
