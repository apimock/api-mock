<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="currentValue"
    @ok="submit"
    @cancel="cancel"
  >
    <a-form-model
      :model="expectForm"
      ref="exceptForm"
      :rules="rules">
      <a-form-model-item label="期望名称" prop="name">
        <a-input v-model="expectForm.name" placeholder="please input name"/>
      </a-form-model-item>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-model-item label="Status">
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
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="Delay" prop="delay">
            <a-input-number
              v-model="expectForm.delay"
              :min="0"
              :max="180000"
              :precision="0"
              :step="100"
              style="width: 100%"/>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-form-model-item label="body" prop="body">
        <json-editor ref="codeEditor" :value="expectForm.body" @save="submit" style="height: 400px"></json-editor>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
  import { ResponseStatus } from '@/utils/enum'
  import JsonEditor from '@/views/components/editor/JsonEditor'
  const expectForm = {
    name: '',
    status: 200,
    delay: 0
  }
  export default {
    name: 'ExpectDialog',
    components: {
      JsonEditor
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '创建期望'
      },
      categoryId: {
        type: [Number, String]
      }
    },
    data () {
      return {
        currentValue: false,
        ResponseStatus,
        expectForm,
        rules: {
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
      }
    },
    methods: {
      submit () {
        console.info(333)
      },
      cancel () {
        this.currentValue = false
      }
    },
    mounted () {
      if (this.value) {
        this.currentValue = true
      }
    }
  }
</script>
