<template>
  <a-drawer
    :width="700"
    title="项目设置"
    placement="right"
    :closable="true"
    :visible="currentValue"
    @close="onClose"
  >
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="基本设置">
        <Base></Base>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script>
  import Base from '@/views/components/setting/Base'
  export default {
    name: 'Setting',
    components: {
      Base
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: false
      }
    },
    watch: {
      currentValue (val) {
        this.$emit('input', val)
      },
      value (val) {
        this.currentValue = val
      }
    },
    methods: {
      onClose () {
        this.currentValue = false
      }
    },
    mounted () {
      if (this.value) {
        this.currentValue = true
      }
    }
  }
</script>

<style scoped>

</style>
