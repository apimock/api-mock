<template>
  <div class="detail-wrap">
    <a-tabs
      type="card"
      class="top-tabs"
      :tabBarGutter="10"
      size="small"
      :activeKey="tabActiveKey"
      @change="changeTab"
      :animated="false">
      <a-tab-pane v-for="pane in tabPanes" :key="pane.key">
        <span slot="tab">
          <a-icon :type="pane.icon" />
          {{ pane.title }}
        </span>
        <Preview v-if="pane.key === 'preview'"></Preview>
        <Edit v-if="pane.key === 'edit'"></Edit>
        <advace-mock v-if="pane.key === 'advance'"></advace-mock>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import Preview from '@/views/mock/detail/Preview'
  import Edit from '@/views/mock/detail/Edit'
  import AdvaceMock from '@/views/mock/detail/AdvaceMock'
  import { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    components: {
      Preview,
      Edit,
      AdvaceMock
    },
    data () {
      return {
      }
    },
    computed: {
      ...mapState('mock', ['tabPanes', 'tabActiveKey'])
    },
    methods: {
      ...mapMutations('mock', ['SET_MOCK_ID', 'SET_TAB_ACTIVE_KEY']),
      ...mapActions('mock', ['getDetail']),
      changeTab (key) {
        this.SET_TAB_ACTIVE_KEY(key)
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.getDetail(to.params.mockId)
      next()
    },
    created () {
      this.getDetail(this.$route.params.mockId)
    }
  }
</script>

<style lang="less">
  .detail-wrap {
    margin-top: 20px;

    .top-tabs {
      &.ant-tabs-card {
        .ant-tabs-tab {
          height: 36px;
          padding: 0 20px;
        }

        .ant-tabs-tab-active::before {
          border-top: 2px solid #1890ff;
        }

        .ant-tabs-nav-container {
          height: 36px;
        }
      }

      .normal-tabs{
        .ant-tabs-tab-active::before {
          border-top: 2px solid transparent!important;
        }
        .ant-tabs-tab {
          height: 36px;
          padding: 0 16px!important;
        }
      }

      .ant-card-small > .ant-card-head{
        min-height: 30px;
        border-bottom: 1px dashed #e8e8e8;
      }
      .ant-card-small > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title {
        padding: 5px 0;
      }
    }

    .ant-tabs-bar {
      margin: 0;
    }

    .ant-tabs-content {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-top: none;
    }
  }
</style>
