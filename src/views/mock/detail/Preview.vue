<template>
  <div class="preview" v-if="detail">
    <a-affix :offset-top="20" class="affix-buttons">
      <a-button-group>
        <a-button size="large" type="primary" icon="edit" @click="edit">edit</a-button>
        <a-button size="large" @click="view" icon="eye">view</a-button>
        <a-button size="large" @click="switchTab('advance')" icon="experiment">高级Mock</a-button>
      </a-button-group>
    </a-affix>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-card class="edit-card response" size="small" title="响应模板" style="margin-top: 100px">
          <div class="editor-box">
            <json-editor ref="codeEditor" :value="detail.body" :read-only="true" style="height: 600px;border-top:1px solid #eee"></json-editor>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card class="edit-card response" size="small" style="margin-top: 100px">
          <span slot="title">
            响应数据
            <a-button style="border:none" size="small" icon="reload" :loading="iconLoading" @click="reloadMockValue"></a-button>
          </span>
          <div class="editor-box">
            <json-editor ref="previewEditor" :value="mockValue" :read-only="true" style="height: 600px; border-top:1px solid #eee"></json-editor>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import JsonEditor from '@/views/components/editor/JsonEditor'
  import { Affix } from 'ant-design-vue'
  import { Method } from '@/utils/enum'
  export default {
    name: 'DetailPreview',
    components: {
      JsonEditor,
      'a-affix': Affix
    },
    data () {
      return {
        reqTabActiveKey: 'query',
        resTabActiveKey: 'code',
        iconLoading: false
      }
    },
    computed: {
      ...mapState('mock', ['detail', 'projectId', 'project', 'mockValue'])
    },
    methods: {
      ...mapActions('mock', ['getProject', 'switchTab', 'getMockValue']),
      edit () {
        this.switchTab('edit')
      },
      view () {
        const baseUrl = this.project.base_url
        this.baseURL = `${location.origin}/mock/${this.projectId}${baseUrl}`
        const url = `${this.baseURL}${this.detail.url}#!method=${Method[this.detail.method]}`
        window.open(url)
      },
      reloadMockValue () {
        this.iconLoading = true
        this.getMockValue()
        setTimeout(() => {
          this.iconLoading = false
        }, 500)
      }
    },
    mounted () {
      this.getProject()
    }
  }
</script>

<style lang="less">
  .preview{
    padding: 20px;

    .affix-buttons{
      position: absolute;
      right:50px;
      top:90px;
      z-index: 99;
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.05), 0 2px 2px 0 rgba(0,0,0,.05), 0 1px 5px 1px rgba(0,0,0,.05);
    }

    .ant-card-body{
      padding: 0;
    }

    .editor-box{
      overflow: hidden;
      .json-editor{
        margin-left: -10px;
        .ace_warning, .ace_error, .ace_info{
          background-image: none;
        }
      }
    }
  }
</style>
