<template>
  <div>
    <div class="mock-editor-wrap">
      <div @click="view">mock地址</div>
      <div class="mock-form">
        <a-form-model
          :model="mockForm"
          ref="mockForm"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          @submit="submit">
          <a-form-model-item label="URL" prop="url">
            <a-input v-model="mockForm.url" placeholder="please input url">
              <a-select v-model="mockForm.method" slot="addonBefore" style="width: 120px">
                <a-select-option v-for="(item, index) in MethodArray" :key="index" :value="item.method">
                  <a-tag style="width: 80px; text-align: center" :color="methodTagColor(item.code)">{{ item.method }}</a-tag>
                </a-select-option>
              </a-select>
            </a-input>
          </a-form-model-item>
          <a-form-model-item label="Description" prop="description">
            <a-input v-model="mockForm.description" placeholder="please input description" />
          </a-form-model-item>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-model-item label="Response Status">
                <a-select
                  v-model="mockForm.status"
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
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="Response Delay" prop="delay">
                <a-input-number
                  v-model="mockForm.delay"
                  :min="0"
                  :max="180000"
                  :precision="0"
                  :step="100"
                  style="width: 100%"/>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item>
            <a-button type="primary" block htmlType="submit">
              Submit
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div class="request">
        <div class="edit-title">请求参数</div>
        <a-tabs v-model="reqTabActiveKey" :animated="false">
          <a-tab-pane v-if="showBodyQueryTab" key="body" tab="Body Params">
            <a slot="extra" href="#">批量添加</a>
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
            <tree-table v-model="mockForm.body_params" name="body_params"></tree-table>
          </a-tab-pane>
          <a-tab-pane key="query" tab="Query Params">
            <a slot="extra" href="#">批量添加</a>
            <tree-table v-model="mockForm.query_params" name="query_params"></tree-table>
          </a-tab-pane>
          <a-tab-pane key="header" tab="Headers">
            <a-card size="small" title="请求参数" :bordered="false" style="width: 100%">
              <tree-table v-model="mockForm.headers" name="headers"></tree-table>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="mock-editor">
        <a-card size="small" title="响应内容" :bordered="false" style="width: 100%">
          <a slot="extra" href="#">more</a>
          <p>card content</p>
          <p>card content</p>
        </a-card>
        <a-tabs v-model="resTabActiveKey" :animated="false" @change="changeResTab">
          <a-tab-pane key="code" tab="模板">
            <ace-editor ref="codeEditor" v-model="mockForm.body" :type="type" @save="submit"></ace-editor>
          </a-tab-pane>
          <a-tab-pane key="preview" tab="预览">
            <ace-editor ref="previewEditor" v-model="previewEditorValue" :read-only="true"></ace-editor>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import ApiMock from '@/api/mock'
  import { Method, MethodTagColor, MethodArray, ResponseStatus } from '@/utils/enum'
  import { jsonParse, checkJson5 } from '@/utils'
  import TreeTable from '@/views/components/TreeTable'
  import AceEditor from '@/views/components/editor/AceEditor'
  const mockForm = {
    id: '',
    url: '',
    method: 'get',
    delay: 0,
    status: 200,
    description: '',
    headers: [],
    query_params: [],
    body_params: [],
    body_params_type: 1,
    body: '{}'
  }
  export default {
    components: {
      TreeTable,
      AceEditor
    },
    data () {
      return {
        projectId: this.$route.params.projectId,
        mockId: this.$route.params.mockId,
        mockForm,
        MethodArray,
        ResponseStatus,
        showBodyQueryTab: false,
        reqTabActiveKey: 'query',
        resTabActiveKey: 'code',
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        rules: {
          url: [
            { required: true, message: 'Please input url', trigger: 'blur' }
          ],
          description: [{ required: true, message: 'Please input description', trigger: 'blur' }],
          body: [{ required: true, message: 'Please input body', trigger: 'blur' }]
        },
        codeEditorValue: 'abc',
        previewEditorValue: '',
        type: 'json'
      }
    },
    watch: {
      'mockForm.method' (val) {
        if (['post', 'put', 'delete', 'patch'].includes(val)) {
          this.showBodyQueryTab = true
          this.reqTabActiveKey = 'body'
        } else {
          this.showBodyQueryTab = false
          this.reqTabActiveKey = 'query'
        }
      }
    },
    methods: {
      async getDetail () {
        const { data } = await ApiMock.detail({ id: this.mockId })
        const { code, bean } = data
        if (code !== 200) {
          this.$message.error('加载失败！')
          return
        }
        this.mockForm = Object.assign(Object.create(null), this.mockForm, bean)
        this.mockForm.headers = jsonParse(this.mockForm.headers) || []
        this.mockForm.query_params = jsonParse(this.mockForm.query_params) || []
        this.mockForm.body_params = jsonParse(this.mockForm.body_params) || []
        this.mockForm.method = Method[bean.method]
        this.$refs.codeEditor.setValue(this.mockForm.body)
      },
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      filterEmptyName (items) {
        return items.filter((item) => {
          return item.name !== ''
        })
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
          mockData.headers = this.filterEmptyName(mockData.headers)
          mockData.query_params = this.filterEmptyName(mockData.query_params)
          mockData.body_params = this.filterEmptyName(mockData.body_params)

          const { data } = await ApiMock.update(mockData)
          const { code, message } = data
          if (code === 200) {
            this.$message.success('更新成功')
          } else {
            this.$message.error(message)
          }
        })
      },
      changeResTab (key) {
        if (key === 'preview') {
          const val = this.$refs.codeEditor.getMockValue()
          this.$nextTick(() => {
            this.$refs.previewEditor.setValue(val)
          })
        }
      },
      view () {
        const baseUrl = '/pro'
        this.baseURL = `${location.origin}/mock/${this.projectId}${baseUrl}`
        const url = `${this.baseURL}${this.mockForm.url}#!method=${this.mockForm.method}`
        window.open(url)
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.project_id = to.params.projectId
      this.mockId = to.params.mockId
      this.getDetail()
      next()
    },
    created () {
      this.getDetail()
    }
  }
</script>

<style scoped lang="less">

</style>
