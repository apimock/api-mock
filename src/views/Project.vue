<template>
  <div class="card-list" ref="content">
    <a-list
      rowKey="id"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :dataSource="dataSource"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <template v-if="!item || item.id === undefined">
          <a-button @click="showModal" class="new-btn" type="dashed">
            <a-icon type="plus"/>
            新增产品
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta>
              <a slot="title">{{ item.name }}</a>
              <div class="meta-content" slot="description">{{ item.description }}</div>
            </a-card-meta>
            <template class="ant-card-actions" slot="actions">
              <router-link :to="{name: 'mock', params: { projectSign: item.sign }}"><a-icon key="eye" type="eye" /></router-link>
              <a><a-icon key="edit" type="edit" @click="update(item)"/></a>
              <a><a-icon key="delete" type="delete" @click="remove(item.id)"/></a>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
    <a-modal
      title="add project"
      :visible="modal.show"
      :confirm-loading="modal.confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model layout="vertical" :model="projectForm" ref="projectForm" :rules="rules">
        <a-form-model-item label="Name" prop="name">
          <a-input v-model="projectForm.name" placeholder="please input name"/>
        </a-form-model-item>
        <a-form-model-item label="Base Url" prop="base_url">
          <a-input v-model="projectForm.base_url" placeholder="please input base url"/>
        </a-form-model-item>
        <a-form-model-item label="Description" prop="description">
          <a-input v-model="projectForm.description" placeholder="please input description"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import ApiProject from '@/api/project'

  export default {
    name: 'CardList',
    data () {
      return {
        dataSource: [],
        modal: {
          id: '',
          show: false,
          confirmLoading: false
        },
        projectForm: {},
        rules: {
          name: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' }
          ],
          description: [{ required: true, message: 'Please input activity form', trigger: 'blur' }]
        }
      }
    },
    methods: {
      async getList () {
        const { data } = await ApiProject.list()
        const { bean, code } = data
        if (code === 200) {
          this.dataSource = !bean.data.length ? [{}] : bean.data
        }
      },
      handleOk () {
        this.$refs.projectForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          if (!this.modal.id) {
            const { data } = await ApiProject.create({ ...this.projectForm })
            const { code, message } = data
            if (code === 200) {
              this.$message.success('创建成功')
              this.modal.show = false
              this.getList()
            } else {
              this.$message.error(message)
            }
          } else {
            const { data } = await ApiProject.update({ ...this.projectForm })
            const { code, message } = data
            if (code === 200) {
              this.$message.success('更新成功')
              this.modal.show = false
              this.getList()
            } else {
              this.$message.error(message)
            }
          }
        })
      },
      handleCancel () {
        this.modal.show = false
      },
      showModal () {
        this.modal.id = ''
        this.modal.show = true
      },
      update (item) {
        this.modal.id = item.id
        this.projectForm = Object.assign(Object.create(null), this.projectForm, item)
        this.modal.show = true
      }
    },
    created () {
      this.getList()
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .card-list {
    /deep/ .ant-card-body:hover {
      .ant-card-meta-title>a {
        color: @primary-color;
      }
    }

    /deep/ .ant-card-meta-title {
      margin-bottom: 12px;

      &>a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0,0,0,.85);
      }
    }

    /deep/ .meta-content {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;

      margin-bottom: 1em;
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
        &:hover {
          color: @primary-color;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 188px;
  }

</style>
