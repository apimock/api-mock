<template>
  <div>Preview
    <a-button @click="edit">edit</a-button>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: 'DetailPreview',
    methods: {
      ...mapMutations('mock', ['SET_TAB_PANES', 'SET_TAB_ACTIVE_KEY']),
      edit () {
        const data = [{ title: '编 辑', key: 'edit', icon: 'edit' }]
        this.SET_TAB_PANES(data)
        this.SET_TAB_ACTIVE_KEY('edit')
      }
    }
  }
</script>

<style scoped lang="less">

</style>
