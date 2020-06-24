<template>
  <div class="diff-editor" ref="editor"></div>
</template>

<script>
  import * as monaco from 'monaco-editor'
  export default {
    name: 'DiffEditor',
    props: {
      originalCode: {
        type: String,
        default: ''
      },
      modifiedCode: {
        type: String,
        default: ''
      },
      language: {
        type: String,
        default: 'javascript'
      },
      inline: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      const diffEditor = monaco.editor.createDiffEditor(this.$refs.editor, {
        language: 'javascript'
        // enableSplitViewResizing: false,
        // Render the diff inline
        // renderSideBySide: this.inline
      })
      diffEditor.setModel({
        original: monaco.editor.createModel(this.originalCode, 'javascript'),
        modified: monaco.editor.createModel(this.modifiedCode, 'javascript')
      })
    }
  }
</script>

<style scoped lang="less">
  .diff-editor{
    height: 200px;
  }
</style>
