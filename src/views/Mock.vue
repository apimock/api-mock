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
        <a-tag style="width:70px" :color="methodTagColor(text)">{{methodToString(text)}}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button-group size="small">
          <a-button @click="view(record, text)"><a-icon type="eye" /></a-button>
          <a-button><a-icon type="edit" /></a-button>
          <a-button><a-icon type="link" /></a-button>
        </a-button-group>
        <a-button style="margin-left:5px" size="small"><a-icon type="more" /></a-button>
      </span>
    </s-table>
  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import ApiMock from '@/api/mock'
  import { Method, MethodTagColor } from '@/utils/enum'

  export default {
    name: 'Mock',
    components: {
      STable
    },
    data () {
      return {
        queryParam: {
          project_sign: this.$route.params.projectSign
        },
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
            Object.assign(parameter, this.queryParam)
          )
          return data.bean
        },
        selectedRowKeys: [],
        selectedRows: []
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
        const { projectSign, baseUrl } = this.$route.params
        const url = `${location.origin}/mock/${projectSign}${baseUrl}${record.url}`
        window.open(url)
        console.info(url)
      }
    }
  }
</script>
