<template>
  <div>detail</div>
</template>

<script>
  import ApiMock from '@/api/mock'
  export default {
    data () {
      return {
        projectId: this.$route.params.projectId,
        mockId: this.$route.params.mockId
      }
    },
    methods: {
      async getDetail () {
        const { data } = await ApiMock.detail({ id: this.mockId })
        const { code, bean } = data
        console.info(code, bean)
      }
    },
    beforeRouteUpdate (to, from, next) {
      this.project_id = to.params.projectId
      this.mockId = to.params.mockId
      this.getDetail()
      next()
    },
    created () {
      this.getDetail()
    }
  }
</script>

<style scoped lang="less">

</style>
