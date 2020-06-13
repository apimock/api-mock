<template>
  <a-card :bordered="true" class="detail-list">
    <a-row type="flex" justify="space-between" class="top">
      <a-col class="left" v-if="category">
        <a-icon :type="category.icon" theme="filled"></a-icon> <span >{{ category.name }}</span> <span v-if="totalCount > 0">({{ totalCount }})</span>
      </a-col>
      <a-col>
        <a-button type="primary" icon="plus" @click="addApi">添加接口</a-button>
      </a-col>
    </a-row>
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      showPagination="auto"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="name" slot-scope="text, record">
        <a @click="toDetail(record)">{{ text }}</a>
      </span>
      <span slot="url" slot-scope="text, record">
        <a-tag :color="methodTagColor(record.method)">{{ methodToString(record.method) }}</a-tag><a @click="toView(record)">{{ text }}</a>
      </span>
      <span slot="avatar" slot-scope="text">
        <a-tooltip>
          <template slot="title">
            {{ text.username }}
          </template>
          <a-avatar :src="text.avatar" :title="text.username" :size="28" />
        </a-tooltip>
      </span>
      <span slot="more" slot-scope="text">
        {{ text }}
      </span>
      <span slot="actionTitle"> 操作 <span style="color: #ccc">|</span> <a-icon @click="test" type="ellipsis" style="font-size: 30px; vertical-align: middle" /></span>
      <span slot="action" slot-scope="text, record">
        <a-button-group size="small">
          <!--          <a-button @click="view(record, text)"><a-icon type="eye" /></a-button>-->
          <!--          <a-button @click="createOrUpdate(record)"><a-icon type="left-circle" /></a-button>-->
          <a-button
            v-clipboard:copy="baseURL+record.url"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"><a-icon type="link" /></a-button>
        </a-button-group>
        <a-button size="small" @click="star(record)"><a-icon type="star" :theme="record.hadStar ? 'filled': 'outlined'" /></a-button>
        <a-button style="margin-left:5px" size="small"><a-icon type="more" /></a-button>
      </span>
    </s-table>
    <CreateMockDialog :categoryId="categoryId" v-model="showCreateMockDialog" @success="refresh"></CreateMockDialog>
  </a-card>
</template>

<script>
  import { STable } from '@/components'
  import ApiMock from '@/api/mock'
  import ApiCategory from '@/api/category'
  import { Method, MethodTagColor } from '@/utils/enum'
  import CreateMockDialog from '@/views/components/CreateMockDialog'
  import { mapMutations } from 'vuex'
  import ApiUser from '@/api/user'

  export default {
    components: {
      STable,
      CreateMockDialog
    },
    data () {
      return {
        queryParam: {},
        projectId: this.$route.params.projectId,
        categoryId: this.$route.params.categoryId,
        project: null,
        category: null,
        baseURL: '',
        totalCount: 0,
        showCreateMockDialog: false,
        columns: [
          {
            title: '名称',
            sorter: true,
            dataIndex: 'name',
            width: 150,
            scopedSlots: { customRender: 'name' }
          },
          // {
          //   title: 'Method',
          //   dataIndex: 'method',
          //   width: 100,
          //   align: 'center',
          //   filters: [
          //     { text: 'get', value: '1' },
          //     { text: 'post', value: '2' },
          //     { text: 'put', value: '3' },
          //     { text: 'delete', value: '4' },
          //     { text: 'patch', value: '5' }
          //   ],
          //   scopedSlots: { customRender: 'method' }
          // },
          {
            title: 'URL',
            dataIndex: 'url',
            width: 300,
            sorter: true,
            scopedSlots: { customRender: 'url' }
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
            slots: { title: 'actionTitle' },
            dataIndex: 'action',
            align: 'center',
            width: 150,
            scopedSlots: { customRender: 'action' }
          }
        ],
        loadData: async parameter => {
          const { data } = await ApiMock.list(
            Object.assign(parameter, this.queryParam, { project_id: this.projectId, category_id: this.categoryId })
          )
          data.bean.data.forEach((item) => {
            try {
              const starsArr = JSON.parse(item.user.stars)
              if (starsArr.includes(item.id)) {
                item.hadStar = true
              } else {
                item.hadStar = false
              }
            } catch (e) {
              item.hadStar = false
            }
          })
          this.project = data.bean.project
          const { id, base_url: baseUrl } = data.bean.project
          this.baseURL = `${location.origin}/mock/${id}${baseUrl}`
          this.totalCount = data.bean.totalCount
          return data.bean
        },
        selectedRowKeys: [],
        selectedRows: []
      }
    },
    watch: {
      $route () {
        const refresh = this.$route.params.refresh
        if (refresh) {
          this.refresh()
        }
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.project_id = to.params.projectId
      this.categoryId = to.params.categoryId
      this.getCategory()
      this.refresh()
      next()
    },
    methods: {
      ...mapMutations('mock', ['SET_MOCK_ID']),
      refresh () {
        this.$refs.table.refresh(true)
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
      onCopySuccess (e) {
        this.$message.success('You just copied: ' + e.text)
      },
      onCopyError (e) {
        this.$message.error('Failed to copy texts')
      },
      async getCategory () {
        if (this.categoryId === 'all') {
          this.category = {
            name: '全部分类',
            icon: 'appstore'
          }
          return
        } else if (this.categoryId === 'stars') {
          this.category = {
            name: '我的收藏',
            icon: 'star'
          }
          return
        }
        const { data } = await ApiCategory.getById({ id: this.categoryId })
        const { bean, code } = data
        if (code === 200) {
          bean.icon = 'folder'
          this.category = bean
        }
      },
      addApi () {
        this.showCreateMockDialog = true
      },
      toDetail (record) {
        this.SET_MOCK_ID(record.id)
        this.$router.push({ name: 'mockDetail', params: { categoryId: this.categoryId, mockId: record.id } })
      },
      toView (record) {
        const url = `${this.baseURL}${record.url}#!method=${Method[record.method]}`
        window.open(url)
      },
      async star (record) {
        const type = record.hadStar ? 1 : 0
        const { data } = await ApiUser.star({ stars: [record.id], type })
        const { code } = data
        if (code === 200) {
          this.refresh()
        }
      },
      test () {
        this.columns.splice(0, 1)
      }
    },
    created () {
      this.getCategory()
    }
  }
</script>

<style scoped lang="less">
.detail-list{
  background: #fff;
  height: 100%;

  .top{
    margin-bottom: 15px;
    line-height: 32px;
    color: #808080;

    .left{
      font-size: 18px;
    }
  }
}
</style>
