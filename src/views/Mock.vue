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
        <a-tag style="width:70px" :color="methodTagColor(text)">{{methodToString(text)}}</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-button-group size="small">
          <a-button @click="view(record, text)"><a-icon type="eye" /></a-button>
          <a-button @click="edit(record)"><a-icon type="edit" /></a-button>
          <a-button><a-icon type="link" /></a-button>
        </a-button-group>
        <a-button style="margin-left:5px" size="small"><a-icon type="more" /></a-button>
      </span>
    </s-table>
    <a-drawer
      title="Basic Drawer"
      placement="right"
      :closable="true"
      :width="1000"
      @close="onDrawClose"
      :maskClosable="true"
      :visible="drawer.show"
    >
      <a-row>
        <a-col style="background: black" :span="16" :push="8">
          asdfdf
        </a-col>
        <a-col :span="8" :pull="16">
          <a-form-model layout="vertical" :model="mockForm" ref="mockForm">
            <a-form-model-item label="URL">
              <a-input v-model="mockForm.url" placeholder="please input url" />
            </a-form-model-item>
            <a-form-model-item label="Method">
              <a-select v-model="mockForm.method">
                <a-select-option value="1">
                  get
                </a-select-option>
                <a-select-option value="2">
                  post
                </a-select-option>
                <a-select-option value="3">
                  put
                </a-select-option>
                <a-select-option value="4">
                  delete
                </a-select-option>
                <a-select-option value="5">
                  patch
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="Description">
              <a-input v-model="mockForm.description" placeholder="please input description" />
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary" block>
                Submit
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-col>
      </a-row>
    </a-drawer>
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
        drawer: {
          show: false
        },
        mockForm: {
          url: '',
          method: '1',
          description: ''
        }
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
        const url = `${this.baseURL}${record.url}`
        window.open(url)
      },
      edit (record) {
        this.drawer.show = true
        if (record.id) {
          this.mockForm.url = record.url
          this.mockForm.method = record.method.toString()
          this.mockForm.description = record.description
        }
      },
      onDrawClose () {
        this.drawer.show = false
      }
    }
  }
</script>
