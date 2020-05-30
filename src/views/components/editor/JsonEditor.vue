<template>
  <div class="ace-editor json-editor" ref="editor"></div>
</template>

<script>
  import Editor from '@/views/components/editor/Editor'
  import { MockSnippets } from '@/views/components/editor/mockSnippets'
  import { getMockValue } from '~/common/mock'
  const ace = require('brace')
  const langTools = ace.acequire('ace/ext/language_tools')

  export default {
    name: 'JsonEditor',
    mixins: [Editor],
    methods: {
      getCompletions (editor, session, pos, prefix, callback) {
        if (prefix.length === 0 || session.$modeId === 'ace/mode/javascript') { callback(null, []); return }
        callback(null, MockSnippets.map((item) => {
          return { name: item.value, value: item.value, score: item.value, meta: item.name }
        }))
      },
      getMockValue () {
        return getMockValue(this.currentValue)
      }
    },
    mounted () {
      this.currentValue = this.value
      this.install('json')
      this.editor.setOption('enableSnippets', false)
      langTools.addCompleter({
        identifierRegexps: [/[@]/],
        getCompletions: this.getCompletions
      })
    }
  }
</script>
