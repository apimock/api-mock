<template>
  <div class="ace-editor script-editor" ref="editor"></div>
</template>

<script>
  import Editor from '@/views/components/editor/Editor'
  require('./snippets')

  export default {
    name: 'ScriptEditor',
    mixins: [Editor],
    mounted () {
      this.currentValue = this.value
      this.install('javascript')
      this.editor.setOption('enableSnippets', true)
    }
  }
</script>
