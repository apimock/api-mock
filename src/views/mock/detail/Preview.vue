<template>
  <div class="preview" v-if="detail">
    <a-affix :offset-top="20" class="affix-buttons">
      <a-button-group>
        <a-button size="large" type="primary" icon="edit" @click="edit">edit</a-button>
        <a-button size="large" @click="view" icon="eye">view</a-button>
      </a-button-group>
    </a-affix>
    <a-card class="edit-card response" size="small" title="响应数据" style="margin-top: 100px">
      <div class="editor-box">
        <json-editor ref="codeEditor" :value="detail.body" :read-only="true" style="height: 600px"></json-editor>
      </div>
    </a-card>
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
        resTabActiveKey: 'code'
      }
    },
    computed: {
      ...mapState('mock', ['detail', 'projectId', 'project'])
    },
    methods: {
      ...mapActions('mock', ['getProject', 'switchTab']),
      edit () {
        this.switchTab('edit')
      },
      view () {
        const baseUrl = this.project.base_url
        this.baseURL = `${location.origin}/mock/${this.projectId}${baseUrl}`
        const url = `${this.baseURL}${this.detail.url}#!method=${Method[this.detail.method]}`
        window.open(url)
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
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.05), 0 2px 2px 0 rgba(0,0,0,.05), 0 1px 5px 1px rgba(0,0,0,.05);
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
