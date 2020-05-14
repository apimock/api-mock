<template>
  <div class="page-mock">
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
      <div class="mock-main">
        <div class="mock-left">
          <a-directory-tree default-expand-all>
            <a-tree-node key="0-0" title="parent 0">
              <a-tree-node key="0-0-0" title="leaf 0-0" is-leaf />
            </a-tree-node>
          </a-directory-tree>
        </div>
        <div class="mock-right">bbb</div>
      </div>
    </a-card>
  </div>
</template>

<script>
  import ApiCategory from '@/api/category'
  export default {
    data () {
      return {
        projectSign: this.$route.params.projectSign
      }
    },
    methods: {
      async getCateList () {
        const { data } = await ApiCategory.list({ project_sign: this.projectSign })
        const { bean, code } = data
        if (code === 200) {
          console.info(bean)
        }
      }
    },
    created () {
      this.getCateList()
    }
  }
</script>

<style lang="less" scoped>
  .page-mock{
    .mock-main{
      width: 100%;
      display: flex;
      height: 100%;
      overflow: auto;
      .mock-left{
        border-right: 1px solid #e8e8e8;
        width: 224px;
      }

      .mock-right{
        flex: 1;
      }
    }
  }
</style>
