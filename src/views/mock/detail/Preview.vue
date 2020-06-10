<template>
  <div class="preview" v-if="detail">
    <a-affix :offset-top="20" class="affix-buttons">
      <a-button size="large" type="primary" icon="edit" @click="edit" class="edit-btn">编辑</a-button>
      <a-button size="large" @click="switchTab('advance')" icon="experiment" class="advance-btn">高级Mock</a-button>
    </a-affix>
    <div class="info">
      <h3 class="preview-title" style="margin-top: 0">基本信息</h3>
      <ul>
        <li>
          名称：{{ detail.name }} <a-button size="small" style="border:none" @click="star"><a-icon type="star" :theme="detail.hadStar ? 'filled': 'outlined'"></a-icon></a-button>
        </li>
        <li>
          地址：<a-tag :color="methodTagColor(detail.method)">{{ methodToString(detail.method) }}</a-tag>
          <a @click="view">{{ detail.url }}</a> <a-button icon="copy" size="small" style="border: none" @click="copy" title="复制地址"></a-button>
        </li>
        <li>
          创建人： <a-avatar :src="detail.user.avatar" :title="detail.user.username" :size="28" />  {{ detail.user.username }}
        </li>
        <li>
          <template v-if="detail.updated_at">
            更新时间：{{ detail.updated_at | moment }}
          </template>
          <template v-else>
            创建时间：{{ detail.created_at | moment }}
          </template>
        </li>
      </ul>
    </div>
    <div class="request" v-if="detail.headers.length || detail.query_params.length || detail.body_params.length">
      <h3 class="preview-title">请求参数</h3>
      <div class="editor-box" v-if="detail.headers.length">
        <div class="editor-title">Headers</div>
        <key-value-editor v-model="detail.headers" :read-only="true"></key-value-editor>
      </div>
      <div class="editor-box" v-if="detail.query_params.length">
        <div class="editor-title">Query</div>
        <key-value-editor v-model="detail.query_params" :read-only="true"></key-value-editor>
      </div>
      <div class="editor-box" v-if="detail.body_params.length">
        <div class="editor-title">Body</div>
        <key-value-editor v-model="detail.body_params" :read-only="true"></key-value-editor>
      </div>
    </div>
    <div class="response">
      <h3 class="preview-title">响应数据</h3>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-card class="edit-card response" size="small" title="响应模板">
            <div class="editor-box">
              <json-editor ref="codeEditor" :value="detail.body" :read-only="true" class="preview-json-editor" :height="detail.body === '{}' ? 200 : 600"></json-editor>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card class="edit-card response" size="small">
            <span slot="title">
              响应数据
              <a-button style="border:none" size="small" icon="reload" :loading="iconLoading" @click="reloadMockValue"></a-button>
            </span>
            <div class="editor-box">
              <json-editor ref="previewEditor" :value="mockValue" :read-only="true" class="preview-json-editor" :height="detail.body === '{}' ? 200 : 600"></json-editor>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import JsonEditor from '@/views/components/editor/JsonEditor'
  import { Affix } from 'ant-design-vue'
  import { Method, MethodTagColor } from '@/utils/enum'
  import KeyValueEditor from '@/views/components/KeyValueEditor'
  import ApiUser from '@/api/user'
  export default {
    name: 'DetailPreview',
    components: {
      KeyValueEditor,
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
      ...mapState('mock', ['detail', 'projectId', 'project', 'mockValue', 'baseURL'])
    },
    methods: {
      ...mapActions('mock', ['getProject', 'switchTab', 'getMockValue', 'getDetail']),
      methodToString (num) {
        return Method[num].toUpperCase()
      },
      methodTagColor (num) {
        return MethodTagColor[num]
      },
      edit () {
        this.switchTab('edit')
      },
      view () {
        const url = `${this.baseURL}${this.detail.url}#!method=${Method[this.detail.method]}`
        window.open(url)
      },
      copy () {
        const url = `${this.baseURL}${this.detail.url}`
        this.$copyText(url).then((e) => {
          this.$message.success('You just copied: ' + e.text)
        }, function (e) {
          this.$message.error('Failed to copy texts')
        })
      },
      reloadMockValue () {
        this.iconLoading = true
        this.getMockValue()
        setTimeout(() => {
          this.iconLoading = false
        }, 500)
      },
      async star () {
        const type = this.detail.hadStar ? 1 : 0
        const { data } = await ApiUser.star({ stars: [this.detail.id], type })
        const { code } = data
        if (code === 200) {
          this.getDetail()
        }
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
    .preview-title{
      font-weight: normal;
      font-size: 18px;
      border-left: 2px solid #1890ff;
      padding-left: 8px;
      color: #585858;
      margin-top: 30px;
      line-height: 24px;
      height: 24px;
    }

    .affix-buttons{
      position: absolute;
      right:50px;
      top:90px;
      z-index: 99;

      button{
        box-shadow: 0 3px 1px -2px rgba(0,0,0,.05), 0 2px 2px 0 rgba(0,0,0,.05), 0 1px 5px 1px rgba(0,0,0,.05);
      }

      .advance-btn{
        margin-left: 20px;
        background: #52c41a;
        border-color: #52c41a;
        color: #fff;
      }
    }

    .info{
      ul{
        padding-left: 32px;
        li{
          list-style: unset;
          line-height: 1.5;
          margin-bottom: 20px;
        }
      }
    }

    .request{
      .editor-box{
        margin-bottom: 20px;
        .editor-title{
          margin-bottom: 5px;
          font-size: 16px;
        }
      }
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

    .preview-json-editor{
      border-top:1px solid #eee
    }
  }
</style>
