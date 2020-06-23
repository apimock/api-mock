<template>
  <div class="project-page" ref="content">
    <a-row type="flex" justify="space-between" style="margin-bottom: 20px">
      <a-col>
        <a-button type="primary" icon="plus" @click="showModal">添加项目</a-button>
      </a-col>
      <a-col>
        <a-radio-group :value="source" @change="sourceChange">
          <a-radio-button :value="0">
            全部
          </a-radio-button>
          <a-radio-button :value="1">
            我创建的
          </a-radio-button>
          <a-radio-button :value="2">
            我加入的
          </a-radio-button>
          <a-radio-button :value="3">
            我的收藏
          </a-radio-button>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-list
      class="card-list"
      rowKey="id"
      :pagination="pagination"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item class="card-item" slot="renderItem" slot-scope="item">
        <a-card :hoverable="true">
          <a-list-item-meta :description="item.description">
            <a slot="title">{{ item.name }}</a>
            <a-avatar slot="avatar" :src="item.user.avatar"/>
          </a-list-item-meta>
          <div class="info">
            <span><a-icon type="link"></a-icon> {{ item.base_url }}</span>
            <span><a-icon type="api"></a-icon> {{ item.mockCount }}</span>
          </div>
          <p class="date">
            <template v-if="item.updated_at">
              更新于：{{ item.updated_at| moment }}
            </template>
            <template v-else>
              创建于：{{ item.created_at| moment }}
            </template>
          </p>
          <template class="ant-card-actions" slot="actions">
            <router-link :to="{name: 'mock', params: { projectId: item.id }}">
              <a-icon key="eye" type="eye"/>
              查看
            </router-link>
            <a @click="star(item)">
              <a-icon key="star" type="star" :theme="item.hadStar ? 'filled': 'outlined'"/>
              收藏
            </a>
            <a @click="onSetting(item)">
              <a-icon key="setting" type="setting"/>
              设置
            </a>
          </template>
        </a-card>
      </a-list-item>
    </a-list>
    <a-modal
      title="添加项目"
      :visible="modal.show"
      :confirm-loading="modal.confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model
        :label-col="modal.labelCol"
        :wrapper-col="modal.wrapperCol"
        :model="projectForm"
        ref="projectForm"
        :rules="rules">
        <a-form-model-item label="项目名称" prop="name">
          <a-input v-model="projectForm.name" placeholder="please input name"/>
        </a-form-model-item>
        <a-form-model-item label="基本路径" prop="base_url">
          <a-input v-model="projectForm.base_url" placeholder="please input base url" @blur="onUrlBlur"/>
        </a-form-model-item>
        <a-form-model-item label="项目描述" prop="description">
          <a-textarea v-model="projectForm.description" placeholder="please input description"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <Setting v-model="showSetting" @updated="settingUpdated" @deleted="settingUpdated"></Setting>
  </div>
</template>

<script>
  import ApiProject from '@/api/project'
  import Setting from '@/views/components/setting/Index'
  import { mapActions } from 'vuex'
  import ApiUser from '@/api/user'
  const defaultProjectForm = {
    name: '',
    base_url: '',
    description: ''
  }
  export default {
    name: 'CardList',
    components: {
      Setting
    },
    data () {
      return {
        dataSource: [],
        source: 0,
        pagination: {
          onChange: page => {
            this.getList(page)
          },
          pageSize: 30,
          total: 0,
          hideOnSinglePage: true
        },
        modal: {
          show: false,
          labelCol: { span: 6 },
          wrapperCol: { span: 18 },
          confirmLoading: false
        },
        showSetting: false,
        projectForm: { ...defaultProjectForm },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions('mock', ['getProject']),
      async getList (page = 1) {
        const { data } = await ApiProject.list({
          pageNo: page,
          pageSize: this.pagination.pageSize,
          source: this.source
        })
        const { bean, code } = data
        if (code === 200) {
          this.pagination.total = bean.totalCount
          this.dataSource = bean.data
        }
      },
      sourceChange (e) {
        const value = e.target.value
        this.source = value
        this.getList()
      },
      onUrlBlur (e) {
        const value = e.target.value.trim()
        if (value !== '' && !/^\/.*$/.test(value)) {
          this.projectForm.base_url = `/${value}`
        } else if (value === '') {
          this.projectForm.base_url = ''
        }
      },
      handleOk () {
        this.$refs.projectForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          const { data } = await ApiProject.create({ ...this.projectForm })
          const { code, message } = data
          if (code === 200) {
            this.$message.success('创建成功')
            this.modal.show = false
            this.getList()
          } else {
            this.$message.error(message)
          }
        })
      },
      handleCancel () {
        this.modal.show = false
      },
      showModal () {
        this.projectForm = { ...defaultProjectForm }
        this.modal.show = true
      },
      async onSetting (item) {
        await this.getProject(item.id)
        this.showSetting = true
      },
      settingUpdated () {
        this.getList()
      },
      async star (record) {
        const type = record.hadStar ? 1 : 0
        const { data } = await ApiUser.star({ field: 'star_project', values: [record.id], type })
        const { code } = data
        if (code === 200) {
          this.getList()
        }
      }
    },
    created () {
      this.getList()
    }
  }
</script>

<style lang="less">

  .project-page {
    margin: 30px;

    .ant-list-pagination {
      text-align: center;
    }

    .card-list {
      .ant-card {
        background: #fff;

        .ant-list-item-meta-title {
          font-size: 16px;
        }

        .ant-list-item-meta-description {
          font-size: 13px;
          height: 47px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .info {
          background: #f0f2f5;
          color: #808080;
          padding: 8px;
          border-radius: 5px;
          font-size: 16px;
          margin-top: 5px;

          span {
            margin-right: 30px;
          }
        }

        .date {
          margin-top: 10px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;
      }
    }
  }

</style>
