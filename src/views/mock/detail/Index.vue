<template>
  <div class="detail-wrap">
    <a-tabs type="card" :tabBarGutter="10" size="small" v-model="activeKey" :animated="false">
      <a-tab-pane key="preview" tab="预 览">
        sfdfdfd
      </a-tab-pane>
      <a-tab-pane key="edit" tab="编 辑">
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
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { Method, MethodTagColor, MethodArray, ResponseStatus } from '@/utils/enum'
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
    body: '{}',
    is_json: true
  }
  export default {
    data () {
      return {
        activeKey: 'preview',
        mockForm
      }
    }
  }
</script>

<style scoped lang="less">
  .detail-wrap{
    margin-top: 20px;
  }
</style>
