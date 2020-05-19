<template>
  <a-modal
    title="创建接口"
    :visible="currentValue"
    @ok="createApiOk"
    @cancel="createApiCancel"
  >
    <a-form-model
      :model="mockForm"
      ref="mockForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules">
      <a-form-model-item label="接口分类" prop="category">
        <a-select v-model="mockForm.category_id">
          <a-select-option v-for="(item, index) in categorys" :key="index" :value="item.id">
            {{item.name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="URL" prop="url">
        <a-input v-model="mockForm.url" placeholder="please input url">
          <a-select v-model="mockForm.method" slot="addonBefore" style="width: 90px">
            <a-select-option v-for="(item, index) in MethodArray" :key="index" :value="item.method">
              <strong :style="{color: methodTagColor(item.code)}">{{ item.method }}</strong>
            </a-select-option>
          </a-select>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="Description" prop="description">
        <a-input v-model="mockForm.description" placeholder="please input description" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>

</template>

<script>
  import { Method, MethodTagColor, MethodArray, ResponseStatus } from '@/utils/enum'
  import ApiMock from '@/api/mock'
  import ApiCategory from '@/api/category'
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
    project_id: '',
    category_id: '',
    body: '{}'
  }
  export default {
    name: 'CreateMockDialog',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      projectId: {
        type: [Number, String]
      },
      categoryId: {
        type: [Number, String]
      }
    },
    data () {
      return {
        currentValue: false,
        mockForm,
        MethodArray,
        ResponseStatus,
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        rules: {
          url: [
            { required: true, message: 'Please input url', trigger: 'blur' }
          ],
          description: [{ required: true, message: 'Please input description', trigger: 'blur' }]
        },
        categorys: []
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
        this.mockForm.category_id = this.categoryId
        this.getCateList()
      }
    },
    methods: {
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      async createApiOk () {
        this.$refs.mockForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          this.mockForm.project_id = this.projectId
          const { data } = await ApiMock.create({ ...this.mockForm })
          const { code, message } = data
          if (code === 200) {
            this.$message.success('创建成功')
            this.currentValue = false
          } else {
            this.$message.error(message)
          }
        })
      },
      createApiCancel () {
        this.currentValue = false
      },
      async getCateList () {
        const { data } = await ApiCategory.list({ project_id: this.projectId })
        const { bean, code } = data
        if (code === 200) {
          this.categorys = bean
        }
      }
    },
    mounted () {
      if (this.value) {
        this.currentValue = true
      }
    }
  }
</script>

<style scoped lang="less">
</style>
