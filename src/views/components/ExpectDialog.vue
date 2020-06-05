<template>
  <a-modal
    :title="title"
    :width="700"
    :visible="currentValue"
    @ok="submit"
    @cancel="cancel"
    class="expect-dialog"
  >
    <a-form-model
      style="height: 430px; overflow: auto"
      :model="expectForm"
      ref="expectForm"
      class="exceptForm"
      :rules="rules">
      <a-card title="匹配设置" size="small">
        <a-form-model-item label="期望名称" prop="name" :labelCol="{span:4}" :wrapperCol="{span:10}">
          <a-input v-model="expectForm.name" placeholder="please input name"/>
        </a-form-model-item>
        <a-form-model-item label="参数匹配" :labelCol="{span:4}" :wrapperCol="{span:19}">
          <key-value-editor v-model="expectForm.params" :only-key-value="true" ref="keyValueParams"></key-value-editor>
        </a-form-model-item>
      </a-card>
      <a-card title="响应设置" size="small" style="margin-top: 20px">
        <a-form-model-item label="状态码" :labelCol="{span:4}" :wrapperCol="{span:10}">
          <a-select
            v-model="expectForm.status"
            show-search
            :dropdownMatchSelectWidth="false"
          >
            <a-select-option v-for="(item, index) in ResponseStatus" :key="index" :value="item.code">
              <template v-if="item.code !== 0">
                <a-tag :color="item.color">{{ item.code }}</a-tag> {{ item.desc }}
              </template>
              <a-divider v-if="item.code === 0" style="margin: 4px 0;" />
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="延时(ms)" prop="delay" :labelCol="{span:4}" :wrapperCol="{span:4}">
          <a-input-number
            v-model="expectForm.delay"
            :min="0"
            :max="180000"
            :precision="0"
            :step="100"
            style="width: 100%"/>
        </a-form-model-item>
        <a-form-model-item label="Headers" :labelCol="{span:4}" :wrapperCol="{span:19}">
          <key-value-editor v-model="expectForm.headers" :only-key-value="true" :key-source="ResponseHeaders" ref="keyValueHeaders"></key-value-editor>
        </a-form-model-item>
        <a-form-model-item label="Body" prop="body" style="margin-bottom: 0">
          <json-editor ref="codeEditor" :value="expectForm.body" @save="submit" style="height: 400px; border-top:1px solid #ddd"></json-editor>
        </a-form-model-item>
      </a-card>
    </a-form-model>
  </a-modal>
</template>

<script>
  import { ResponseStatus, ResponseHeaders } from '@/utils/enum'
  import { mapState } from 'vuex'
  import JsonEditor from '@/views/components/editor/JsonEditor'
  import { checkJson5, jsonParse } from '@/utils'
  import ApiExpect from '@/api/expect'
  import KeyValueEditor from '@/views/components/KeyValueEditor'
  const expectForm = {
    name: '',
    params: [],
    status: 200,
    delay: 0,
    headers: []
  }
  export default {
    name: 'ExpectDialog',
    components: {
      JsonEditor,
      KeyValueEditor
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      formData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        currentValue: false,
        ResponseStatus,
        ResponseHeaders,
        expectForm,
        title: '',
        rules: {
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapState('mock', ['mockForm', 'mockId'])
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
        if (val) {
          this.setExpectForm()
        }
      }
    },
    methods: {
      submit () {
        this.$refs.expectForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          const body = this.$refs.codeEditor.getValue()
          if (!checkJson5(body)) {
            this.$message.error('返回Body json格式有问题，请检查！')
            return
          }
          const formData = { ...this.expectForm, body, mock_id: this.mockId }
          if (formData.id) {
            const { data } = await ApiExpect.update(formData)
            const { code, message } = data
            if (code) {
              this.$message.success('更新成功！')
              this.currentValue = false
              this.$emit('update')
            } else {
              this.$message.error(message)
            }
          } else {
            const { data } = await ApiExpect.create(formData)
            const { code, message } = data
            if (code) {
              this.$message.success('创建成功！')
              this.currentValue = false
              this.$emit('update')
            } else {
              this.$message.error(message)
            }
          }
        })
      },
      cancel () {
        this.currentValue = false
      },
      setExpectForm () {
        const val = this.formData
        if (!val) {
          this.title = '添加期望'
          this.expectForm = { ...expectForm, body: this.mockForm.body }
          this.$refs.keyValueParams && this.$refs.keyValueParams.clear()
          this.$refs.keyValueHeaders && this.$refs.keyValueHeaders.clear()
        } else {
          this.title = '编辑期望'
          this.expectForm = val
          this.expectForm.params = jsonParse(this.expectForm.params) || []
          this.expectForm.headers = jsonParse(this.expectForm.headers) || []
        }
      }
    },
    mounted () {
      if (this.value) {
        this.currentValue = true
        this.setExpectForm()
      }
    }
  }
</script>

<style lang="less">
  .expect-dialog{
    .ant-modal-close-x{
      width: 46px;
      height: 46px;
      line-height: 46px;
    }
    .ant-modal-header{
      padding: 10px 24px;
    }
    .ant-modal-body{
      padding: 15px;
    }
  }
  .exceptForm{
    .ant-card-head{
      border-bottom: 1px dashed #eee;
      min-height: 24px;
      .ant-card-head-title{
        padding: 5px 0!important;
      }
    }
    .ant-card-body{
      padding:24px 0 0 0;
    }
  }
</style>
