<template>
  <div class="ace-editor" ref="editor"></div>
</template>

<script>
  const ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/monokai')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  export default {
    name: 'AceEditor',
    props: {
      value: {
        required: false,
        default: ''
      }
    },
    methods: {
      install () {
        this.editor = ace.edit(this.$refs.editor)
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setTheme('ace/theme/monokai')
        this.editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: false,
          enableLiveAutocompletion: true,
          useWorker: true
        })
        this.editor.setValue(this.value)
      }
    },
    mounted () {
      this.install()
    }
  }
</script>

<style lang="less" scoped>
.ace-editor{
  width: 100%;
  height: 300px;
}
</style>
