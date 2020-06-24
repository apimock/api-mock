<template>
  <a-drawer
    :width="700"
    title="动态"
    placement="right"
    :closable="true"
    :visible="currentValue"
    class="history"
    @close="onClose"
  >
    <a-timeline class="timeline">
      <a-timeline-item v-for="(item, index) in historyList" :key="index">
        <a-avatar slot="dot" :src="item.user.avatar"></a-avatar>
        <div class="title"><a>{{ item.user.username }}</a> <span v-html="item.title"></span> <span class="date">{{ item.created_at|moment }}</span></div>
        <div class="content">
          {{ item.content }}
          <a-button @click="showDetail">详情</a-button>
        </div>
      </a-timeline-item>
    </a-timeline>
    <a-modal
      :title="detailModal.title"
      :width="700"
      :visible="detailModal.show"
      class="detail-dialog"
      @ok="detailModal.show=false"
      @cancel="detailModal.show=false"
    >
      <diff-editor :original-code="detailModal.originalCode" :modified-code="detailModal.modifiedCode"></diff-editor>
    </a-modal>
  </a-drawer>
</template>

<script>
  import ApiHistory from '@/api/history'
  import { mapState } from 'vuex'
  import DiffEditor from '@/views/components/editor/DiffEditor'
  export default {
    name: 'History',
    components: {
      DiffEditor
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: false,
        historyList: [],
        detailModal: {
          title: '详情',
          show: false,
          originalCode: '',
          modifiedCode: ''
        }
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
        this.getList()
      }
    },
    computed: {
      ...mapState('mock', ['project'])
    },
    methods: {
      onClose () {
        this.currentValue = false
      },
      async getList () {
        const { data } = await ApiHistory.list({ project_id: this.project.id })
        const { code, bean } = data
        if (code === 200) {
          this.historyList = bean.data
        }
      },
      showDetail () {
        this.detailModal.originalCode = '//abc'
        this.detailModal.modifiedCode = 'abc223'
        this.detailModal.show = true
      }
    },
    mounted () {
      if (this.value) {
        this.currentValue = true
      }
    }
  }
</script>

<style lang="less">
  .history{
    .ant-drawer-wrapper-body{
      background: #f0f2f5;
      .timeline{
        .ant-timeline-item-head{
          background: transparent;
        }
        .title{
          margin-left: 20px;
          color: #24292e;
          .date{
            color: #6a737d;
            font-size: 12px;
          }
        }
        .content{
          margin-top: 8px;
          margin-left: 20px;
          background: #fff;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          padding: 10px;
        }
      }
    }
  }
</style>
