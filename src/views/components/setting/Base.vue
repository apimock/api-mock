<template>
  <div class="base-setting">
    <a-form-model
      v-if="form"
      :model="form"
      ref="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="项目名称" prop="name">
        <a-input v-model="form.name" placeholder="please input name"/>
      </a-form-model-item>
      <a-form-model-item label="基本路径">
        <a-input v-model="form.base_url" placeholder="please input base_url"/>
      </a-form-model-item>
      <a-form-model-item label="项目描述">
        <a-input type="textarea" v-model="form.description" placeholder="please input description"/>
      </a-form-model-item>
      <a-form-model-item label="开启邮件通知">
        <a-switch v-model="form.notify"/>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ offset: 5 }">
        <a-button type="primary" @click="save" icon="save">
          保存
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="danger">
      <h3>危险区域</h3>
      <a-list class="list">
        <a-list-item>
          <a-button slot="actions" type="danger" @click="del">删除项目</a-button>
          <a-list-item-meta description="项目一旦被删除不可恢复！并且会删除其中所有的接口！">
            <h4 slot="title">删除项目</h4>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import ApiProject from '@/api/project'
  export default {
    data () {
      return {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        form: null,
        delProjectName: ''
      }
    },
    computed: {
      ...mapState('mock', ['project'])
    },
    watch: {
      project () {
        this.setForm()
      }
    },
    methods: {
      setForm () {
        this.form = { ...this.project }
        this.form.notify = !!this.project.notify
      },
      async save () {
        const saveData = { ...this.form }
        saveData.notify = this.form.notify ? 1 : 0
        const { data } = await ApiProject.update(saveData)
        const { code, message } = data
        if (code === 200) {
          this.$message.success('保存成功！')
          this.$emit('updated')
        } else {
          this.$message.error(message)
        }
      },
      async deleteProject () {
        const { data } = await ApiProject.delete({ id: this.project.id })
        const { code } = data
        if (code === 200) {
          this.$emit('deleted')
        }
      },
      del () {
        const that = this
        const modal = this.$confirm({
          title: `确认删除项目： ${this.project.name} 吗？`,
          content: (
            <div>
              <a-alert message="警告：此操作非常危险！项目一旦被删除不可恢复！并且会删除其中所有的接口！" banner />
              <p>请输入 <strong>{this.project.name}</strong> 确认删除</p>
              <p><a-input ref="confirm" v-model={this.delProjectName}></a-input></p>
            </div>
          ),
          async onOk (e) {
            const value = that.$refs.confirm.$el.value
            if (value === that.project.name) {
              await that.deleteProject()
              modal.destroy()
            } else {
              that.$message.error('项目名输入错误！')
            }
          },
          onCancel () {
          }
        })
      }
    },
    mounted () {
      this.setForm()
    }
  }
</script>

<style scoped lang="less">
  .base-setting{
    width: 600px;

    .danger {
      margin-top: 50px;

      h3{
        font-size: 20px;
      }
      .list{
        border: 1px solid #ff4d4f;
        border-radius: 5px;
        padding: 10px;
      }
    }
  }
</style>
