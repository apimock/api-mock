<template>
  <div class="edit" ref="edit">
    <a-affix :offset-top="20" class="affix-buttons">
      <a-button-group>
        <a-button type="primary" size="large" icon="save" @click="submit">保存</a-button>
        <a-button size="large" icon="logout" @click="cancelSave">取消</a-button>
      </a-button-group>
    </a-affix>
    <a-card title="基础设置" size="small" class="edit-card mock-form">
      <a-form-model
        :model="mockForm"
        ref="mockForm"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        @submit="submit">
        <a-form-model-item label="接口分类" prop="category_id">
          <a-select v-model="mockForm.category_id">
            <a-select-option v-for="(item, index) in categoryTree" :key="index" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="接口URL" prop="url">
          <a-input v-model="mockForm.url" placeholder="please input url">
            <a-select v-model="mockForm.method" slot="addonBefore" style="width: 120px">
              <a-select-option v-for="(item, index) in MethodArray" :key="index" :value="item.method">
                <a-tag style="width: 80px; text-align: center" :color="methodTagColor(item.code)">{{ item.method }}</a-tag>
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="接口描述" prop="description">
          <a-input v-model="mockForm.description" placeholder="please input description" />
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card class="edit-card request" size="small" title="请求参数">
      <a-tabs class="normal-tabs request-tabs" size="small" v-model="reqTabActiveKey" :animated="false">
        <a-tab-pane v-if="showBodyParamsTab" key="body">
          <span slot="tab">
            Body Params
            <a-badge :status="bodyParamsStatus"/>
          </span>
          <a-radio-group v-model="mockForm.body_params_type" style="margin-bottom: 20px">
            <a-radio :value="1">
              form
            </a-radio>
            <a-radio :value="2">
              json
            </a-radio>
            <a-radio :value="3">
              raw
            </a-radio>
            <a-radio :value="4">
              binary
            </a-radio>
          </a-radio-group>
          <key-value-editor v-model="mockForm.body_params"></key-value-editor>
        </a-tab-pane>
        <a-tab-pane key="query">
          <span slot="tab">
            Query Params
            <a-badge :status="queryParamsStatus"/>
          </span>
          <key-value-editor v-model="mockForm.query_params"></key-value-editor>
        </a-tab-pane>
        <a-tab-pane key="header">
          <span slot="tab">
            Headers
            <a-badge :status="headersStatus"/>
          </span>
          <key-value-editor v-model="mockForm.headers" :key-source="Headers"></key-value-editor>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card class="edit-card response" size="small" title="响应数据">
      <a-tabs class="normal-tabs response-tabs" v-model="resTabActiveKey" :animated="false" @change="changeResTab">
        <a-tab-pane key="code" tab="模板">
          <json-editor ref="codeEditor" :value="mockForm.body" :mockSnippets="true" @save="submit" style="height: 600px"></json-editor>
        </a-tab-pane>
        <a-tab-pane key="preview" tab="预览">
          <json-editor ref="previewEditor" :value="previewEditorValue" :read-only="true" style="height: 600px"></json-editor>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
  import { Method, MethodTagColor, MethodArray, ResponseStatus, Headers } from '@/utils/enum'
  import { checkJson5 } from '@/utils'
  import ApiMock from '@/api/mock'
  import { mapState, mapActions } from 'vuex'
  import KeyValueEditor from '@/views/components/KeyValueEditor'
  import { Affix } from 'ant-design-vue'
  import JsonEditor from '@/views/components/editor/JsonEditor'

  export default {
    name: 'DetailEdit',
    components: {
      KeyValueEditor,
      JsonEditor,
      'a-affix': Affix
    },
    data () {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
        MethodArray,
        ResponseStatus,
        rules: {
          category_id: [{ required: true, message: 'Please input url' }],
          url: [{ required: true, message: 'Please input url', trigger: 'blur' }],
          description: [{ required: true, message: 'Please input description', trigger: 'blur' }],
          body: [{ required: true, message: 'Please input body', trigger: 'blur' }]
        },
        reqTabActiveKey: 'query',
        resTabActiveKey: 'code',
        previewEditorValue: '',
        Headers,
        bodyParamsStatus: 'default',
        queryParamsStatus: 'default',
        headersStatus: 'default'
      }
    },
    computed: {
      ...mapState('mock', ['projectId', 'categoryTree', 'detail', 'mockForm', 'showBodyParamsTab'])
    },
    watch: {
      'showBodyParamsTab': function (val) {
        this.reqTabActiveKey = val ? 'body' : 'query'
      },
      'mockForm.body': function (val) {
        this.resTabActiveKey = 'code'
      },
      'mockForm.body_params': function (val) {
        this.setStatus(val, 'bodyParamsStatus')
      },
      'mockForm.query_params': function (val) {
        this.setStatus(val, 'queryParamsStatus')
      },
      'mockForm.headers': function (val) {
        this.setStatus(val, 'headersStatus')
      }
    },
    methods: {
      ...mapActions('mock', ['getDetail', 'switchTab']),
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      submit (e) {
        if (e) {
          e.preventDefault()
        }
        this.$refs.mockForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          if (!checkJson5(this.mockForm.body)) {
            this.$message.error('返回Body json格式有问题，请检查！')
            return
          }
          const mockData = { ...this.mockForm }
          mockData.body = this.$refs.codeEditor.getValue()

          const { data } = await ApiMock.update(mockData)
          const { code, message } = data
          if (code === 200) {
            this.$message.success('更新成功')
            await this.getDetail()
            this.switchTab('preview')
          } else {
            this.$message.error(message)
          }
        })
      },
      cancelSave () {
        this.switchTab('preview')
      },
      changeResTab (key) {
        if (key === 'preview') {
          const val = this.$refs.codeEditor.getMockValue()
          this.$nextTick(() => {
            this.$refs.previewEditor.setValue(val)
          })
        }
      },
      setStatus (arr, target) {
        const res = arr.some((item) => item.key !== '' && item.value !== '' && item.required)
        if (res) {
          this[target] = 'success'
        } else {
          this[target] = 'default'
        }
      }
    },
    mounted () {
      this.reqTabActiveKey = this.showBodyParamsTab ? 'body' : 'query'
      this.setStatus(this.mockForm.body_params, 'bodyParamsStatus')
      this.setStatus(this.mockForm.query_params, 'queryParamsStatus')
      this.setStatus(this.mockForm.headers, 'headersStatus')
    }
  }
</script>
<style lang="less">
  .edit{
    .request-tabs{
      .ant-tabs-content{
        margin-top: 20px;
        border: none;
      }
    }
  }
</style>

<style scoped lang="less">
  .edit{
    padding: 20px;

    .affix-buttons{
      position: absolute;
      right:50px;
      top:90px;
      z-index: 99;
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.05), 0 2px 2px 0 rgba(0,0,0,.05), 0 1px 5px 1px rgba(0,0,0,.05);
    }

    .edit-card{
      margin-bottom: 20px;
    }

    .mock-form{
      width: 650px;
    }
  }
</style>
