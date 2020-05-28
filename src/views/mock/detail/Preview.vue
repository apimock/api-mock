<template>
  <div class="preview" v-if="detail">
    <a-button-group style="margin-bottom: 20px">
      <a-button size="large" type="primary" @click="edit">edit</a-button>
      <a-button size="large" @click="view">view</a-button>
    </a-button-group>
    <a-card class="edit-card response" size="small" title="响应数据">
      <ace-editor ref="codeEditor" v-model="detail.body" :read-only="true"></ace-editor>
    </a-card>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import AceEditor from '@/views/components/editor/AceEditor'
  export default {
    name: 'DetailPreview',
    components: {
      AceEditor
    },
    data () {
      return {
        reqTabActiveKey: 'query',
        resTabActiveKey: 'code'
      }
    },
    computed: {
      ...mapState('mock', ['detail', 'projectId'])
    },
    watch: {
      'detail.body': function (val) {
        if (val && this.$refs.codeEditor) {
          this.$refs.codeEditor.setValue(val)
        }
      }
    },
    methods: {
      ...mapMutations('mock', ['SET_TAB_PANES', 'SET_TAB_ACTIVE_KEY']),
      edit () {
        const data = [{ title: '编 辑', key: 'edit', icon: 'edit' }]
        this.SET_TAB_PANES(data)
        this.SET_TAB_ACTIVE_KEY('edit')
      },
      view () {
        const baseUrl = '/pro'
        this.baseURL = `${location.origin}/mock/${this.projectId}${baseUrl}`
        const url = `${this.baseURL}${this.detail.url}#!method=${this.detail.method}`
        window.open(url)
      }
    }
  }
</script>

<style scoped lang="less">
  .preview{
    padding: 20px;
  }
</style>
