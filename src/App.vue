<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
  .ant-layout{
    background: #f0f4f8;

    .header-animat{
      box-shadow: 0 0px 5px 2px #8e8e8e;
    }

    .ant-layout-header{
      height: 54px;
    }

    .top-nav-header-index .header-index-wide{
      height: 54px!important;
    }

    .top-nav-header-index .header-index-wide .header-index-left .logo.top-nav-header{
      height: 54px;
      line-height: 54px;
    }

    .top-nav-header-index .header-index-wide .ant-menu.ant-menu-horizontal{
      height: 54px!important;
      line-height: 54px!important;
    }

    .top-nav-header-index .header-index-wide .header-index-left .logo.top-nav-header{
      height: 54px!important;
      line-height: 54px!important;
    }

    .top-nav-header-index .header-index-wide .header-index-right{
      height: 60px!important;
    }

    .ant-layout-header, .ant-menu-dark, .ant-menu-dark .ant-menu-sub{
      background: #252525;
    }

    .ant-card{
      background: none;
    }
    .ant-table-thead > tr > th{
      font-weight: normal;
    }
  }
</style>
