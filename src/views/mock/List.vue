<template>
  <a-card :bordered="false">
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
      <!--      <span slot="action" slot-scope="text, record">-->
      <!--        <a-button-group size="small">-->
      <!--          <a-button @click="view(record, text)"><a-icon type="eye" /></a-button>-->
      <!--          <a-button @click="createOrUpdate(record)"><a-icon type="left-circle" /></a-button>-->
      <!--          <a-button-->
      <!--            v-clipboard:copy="baseURL+record.url"-->
      <!--            v-clipboard:success="onCopySuccess"-->
      <!--            v-clipboard:error="onCopyError"><a-icon type="link" /></a-button>-->
      <!--        </a-button-group>-->
      <!--        <a-button style="margin-left:5px" size="small"><a-icon type="more" /></a-button>-->
      </span>
    </s-table>

  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import ApiMock from '@/api/mock'
  import { Method, MethodTagColor } from '@/utils/enum'

  export default {
    components: {
      STable
    },
    data () {
      return {
        queryParam: {},
        projectSign: this.$route.params.projectSign,
        categoryId: this.$route.params.categoryId,
        project: null,
        baseURL: '',
        columns: [
          {
            title: 'Method',
            dataIndex: 'method',
            width: 100,
            align: 'center',
            filters: [
              { text: 'get', value: '1' },
              { text: 'post', value: '2' },
              { text: 'put', value: '3' },
              { text: 'delete', value: '4' },
              { text: 'patch', value: '5' }
            ],
            scopedSlots: { customRender: 'method' }
          },
          {
            title: 'URL',
            dataIndex: 'url',
            width: 300,
            sorter: true,
            scopedSlots: { customRender: 'url' }
          },
          {
            title: '描述',
            sorter: true,
            dataIndex: 'description'
          },
          {
            title: '创建者',
            dataIndex: 'user',
            align: 'center',
            width: 88,
            filters: [
              { text: 'get', value: 1 },
              { text: 'post', value: 2 },
              { text: 'put', value: 3 },
              { text: 'delete', value: 4 },
              { text: 'patch', value: 5 }
            ],
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
            Object.assign(parameter, this.queryParam, { project_sign: this.projectSign, category_id: this.categoryId })
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
        modalCreateApi: {
          show: false
        },
        rules: {
          url: [
            { required: true, message: 'Please input url', trigger: 'blur' }
          ],
          description: [{ required: true, message: 'Please input description', trigger: 'blur' }],
          body: [{ required: true, message: 'Please input body', trigger: 'blur' }]
        }
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.project_sign = to.params.projectSign
      this.categoryId = to.params.categoryId
      this.$refs.table.refresh(true)
      next()
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
      onCopySuccess (e) {
        this.$message.success('You just copied: ' + e.text)
      },
      onCopyError (e) {
        this.$message.error('Failed to copy texts')
      }
    }
  }
</script>

<style scoped lang="less">

</style>
