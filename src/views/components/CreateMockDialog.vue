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
      <a-form-model-item label="接口分类" prop="category_id">
        <a-select v-model="mockForm.category_id">
          <a-select-option v-for="(item, index) in categoryList" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="接口名称" prop="name">
        <a-input v-model="mockForm.name" placeholder="please input name"/>
      </a-form-model-item>
      <a-form-model-item label="接口地址" prop="url">
        <a-input v-model="mockForm.url" placeholder="/path" @blur="onUrlBlur">
          <a-select v-model="mockForm.method" slot="addonBefore" style="width: 90px">
            <a-select-option v-for="(item, index) in MethodArray" :key="index" :value="item.method">
              <strong :style="{color: methodTagColor(item.code)}">{{ item.method }}</strong>
            </a-select-option>
          </a-select>
        </a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>

</template>

<script>
  import { Method, MethodTagColor, MethodArray, ResponseStatus, KeyAll, KeyStar } from '@/utils/enum'
  import ApiMock from '@/api/mock'
  import { mapState, mapActions, mapMutations } from 'vuex'

  const mockForm = {
    id: '',
    url: '',
    method: 'get',
    delay: 0,
    status: 200,
    name: '',
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
      categoryId: {
        type: [Number, String]
      }
    },
    computed: {
      ...mapState('mock', ['projectId', 'categoryTree'])
    },
    data () {
      return {
        currentValue: false,
        categoryList: [],
        mockForm,
        MethodArray,
        ResponseStatus,
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
        rules: {
          category_id: [{ required: true, message: '请选择分类', trigger: 'blur' }],
          url: [
            { required: true, message: '请输入地址', trigger: 'blur' }
          ],
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
        }
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
        this.getCategoryList()
        if (!isNaN(Number(this.categoryId))) {
          this.mockForm.category_id = Number(this.categoryId)
        } else if (this.categoryList.length && this.categoryList[0]) {
          this.mockForm.category_id = Number(this.categoryList[0].key)
        }
        this.mockForm.name = ''
        this.mockForm.url = ''
      }
    },
    methods: {
      ...mapMutations('mock', ['SET_MOCK_ID']),
      ...mapActions('mock', ['getCategoryList']),
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      onUrlBlur (e) {
        const value = e.target.value
        if (!/^\/.*$/.test(value)) {
          this.mockForm.url = `/${this.mockForm.url}`
        }
      },
      getCategoryList () {
        this.categoryList = this.categoryTree.filter((item) => ![KeyAll, KeyStar].includes(item.key))
      },
      async createApiOk () {
        this.$refs.mockForm.validate(async valid => {
          if (!valid) {
            console.log('error submit!!')
            return false
          }
          if (!/^\/.*$/.test(this.mockForm.url)) {
            this.mockForm.url = `/${this.mockForm.url}`
          }
          this.mockForm.project_id = this.projectId
          const { data } = await ApiMock.create({ ...this.mockForm })
          const { code, message, bean } = data
          if (code === 200) {
            this.getCategoryList()
            this.$emit('success')
            this.$message.success('创建成功')
            this.currentValue = false
            this.SET_MOCK_ID(bean.id)
            this.$router.push({ name: 'mockDetail', params: { categoryId: this.categoryId, mockId: bean.id } })
          } else {
            this.$message.error(message)
          }
        })
      },
      createApiCancel () {
        this.currentValue = false
      }
    },
    mounted () {
      if (this.value) {
        this.currentValue = true
        this.getCategoryList()
      }
    }
  }
</script>

<style scoped lang="less">
</style>
