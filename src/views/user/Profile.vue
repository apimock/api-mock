<template>
  <div class="profile">
    <a-card>
      <div class="avatar">
        <a-avatar :src="avatar"></a-avatar>
      </div>
      <a-form-model
        :model="form"
        v-bind="layout"
        :rules="rules"
        class="form-box"
        ref="profileForm"
      >
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="form.username" placeholder="please input name"/>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email" placeholder="please input email"/>
        </a-form-model-item>
        <a-form-model-item has-feedback label="密码" prop="password">
          <a-input v-model="form.password" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="重复密码" prop="checkPass">
          <a-input v-model="form.checkPass" type="password" autocomplete="off" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 5 }">
          <a-button type="primary" @click="submitForm()">
            提交
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ApiUser from '@/api/user'
  export default {
    name: 'Profile',
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'))
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.profileForm.validateField('checkPass')
          }
          callback()
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入重复密码！'))
        } else if (value !== this.form.password) {
          callback(new Error('重复密码不匹配！'))
        } else {
          callback()
        }
      }
      return {
        form: null,
        layout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 16 }
        },
        rules: {
          password: [{ validator: validatePass, trigger: 'change' }],
          checkPass: [{ validator: validatePass2, trigger: 'change' }]
        }
      }
    },
    computed: {
      ...mapGetters(['nickname', 'avatar', 'userInfo'])
    },
    watch: {
      userInfo () {
        this.setForm()
      }
    },
    methods: {
      ...mapActions(['GetInfo']),
      setForm () {
        this.form = { ...this.userInfo, password: '', checkPass: '' }
      },
      submitForm () {
        this.$refs.profileForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          const { data } = await ApiUser.update(this.form)
          const { code } = data
          if (code === 200) {
            this.$message.success('保存成功！')
            this.GetInfo()
          }
        })
      }
    },
    created () {
      this.setForm()
    }
  }
</script>

<style lang="less">
  .profile{
    margin-top: 100px;
    .ant-card{
      width: 500px;
      margin: 0px auto;
      background: #fff;
      border-radius: 5px;

      .avatar{
        display: block;
        border: 1px solid #e8e8e8;
        padding: 5px;
        background: #fff;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: -80px auto 20px;
        .ant-avatar{
          width: 100%;
          height: 100%;
        }
      }
      .form-box{
      }
    }
  }
</style>
