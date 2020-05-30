<template>
  <div class="advance">
    <ExpectDialog v-model="showExpectDialog"></ExpectDialog>
    <a-tabs class="normal-tabs response-tabs" v-model="activeKey" :animated="false">
      <a-tab-pane key="script" tab="脚本">
        <a-switch v-model="mockForm.enable_script" @change="saveScript"/>
        <script-editor ref="codeEditor" :value="mockForm.script" @save="saveScript" style="height: 600px"></script-editor>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import ScriptEditor from '@/views/components/editor/ScriptEditor'
  import { mapActions, mapState } from 'vuex'
  import ApiMock from '@/api/mock'
  import ExpectDialog from '@/views/components/ExpectDialog'
  export default {
    name: 'AdvanceMock',
    components: {
      ScriptEditor,
      ExpectDialog
    },
    data () {
      return {
        activeKey: 'script',
        showExpectDialog: true
      }
    },
    computed: {
      ...mapState('mock', ['mockForm'])
    },
    methods: {
      ...mapActions('mock', ['getDetail']),
      async saveScript () {
        const mockData = {
          id: this.mockForm.id,
          enable_script: this.mockForm.enable_script === true ? 1 : 0,
          script: this.$refs.codeEditor.getValue()
        }
        if (!/Api\.json/g.test(mockData.script)) {
          this.$message.error(`必须要有 Api.json = `)
          return
        }
        const { data } = await ApiMock.update(mockData)
        const { code, message } = data
        if (code === 200) {
          this.$message.success('更新成功')
          this.getDetail()
        } else {
          this.$message.error(message)
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
