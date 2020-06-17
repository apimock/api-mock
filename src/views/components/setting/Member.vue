<template>
  <div>
    <a-button @click="() => {form.username = ''; showAddDialog=true}" style="margin-bottom: 20px;" icon="plus" type="primary">添加成员</a-button>
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
    >
      <span slot="username" slot-scope="text, record">
        <a-avatar :src="record.user.avatar" :size="28" /> {{ text }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          trigger="click"
          title="确定删除吗?"
          @confirm="del(record)"
        >
          <a-button size="small" type="danger" icon="delete">删除</a-button>
        </a-popconfirm>
      </span>
    </s-table>
    <a-modal
      title="添加成员"
      :width="400"
      :visible="showAddDialog"
      @ok="add"
      @cancel="showAddDialog=false"
      class="expect-dialog"
    >
      <a-form-model
        :model="form"
        ref="addForm"
        class="addForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        >
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="form.username" placeholder="please input username"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ApiMember from '@/api/member'
  import { STable } from '@/components'

  export default {
    name: 'Members',
    components: {
      STable
    },
    data () {
      return {
        showAddDialog: false,
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
        form: {
          username: ''
        },
        columns: [
          {
            title: '成员',
            dataIndex: 'user.username',
            scopedSlots: { customRender: 'username' }
          },
          {
            title: '邮箱',
            dataIndex: 'user.email'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 90,
            scopedSlots: { customRender: 'action' }
          }
        ],
        loadData: async parameter => {
          const { data } = await ApiMember.list({ project_id: this.project.id })
          return data.bean
        }
      }
    },
    computed: {
      ...mapState('mock', ['project'])
    },
    watch: {
      project (val) {
        this.refresh()
      }
    },
    methods: {
      refresh () {
        this.$refs.table.refresh(true)
      },
      async add () {
        const { data } = await ApiMember.create({ username: this.form.username, project_id: this.project.id })
        const { code, message } = data
        if (code === 200) {
          this.showAddDialog = false
          this.refresh()
        } else {
          this.$message.error(message)
        }
      },
      async del (record) {
        const { data } = await ApiMember.delete({ uid: record.user.id, project_id: record.project_id })
        const { code, message } = data
        if (code === 200) {
          this.refresh()
        } else {
          this.$message.error(message)
        }
      }
    }
  }
</script>

<style scoped lang="less">
</style>
