<template>
  <div class="ace-editor" ref="editor"></div>
</template>

<script>
  import { MockSnippets } from '@/views/components/editor/snippets'
  const Mock = require('mockjs')
  const json5 = require('json5')
  const ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/xcode')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  const langTools = ace.acequire('ace/ext/language_tools')
  export default {
    name: 'AceEditor',
    props: {
      value: {
        default: ''
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentValue: '',
        mockValue: ''
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
      install () {
        this.editor = ace.edit(this.$refs.editor)
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setTheme('ace/theme/xcode')
        if (this.readOnly) {
          this.editor.setReadOnly(true)
          this.editor.renderer.$cursorLayer.element.style.display = 'none'
        }
        this.editor.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: false,
          enableLiveAutocompletion: true,
          useWorker: true
        })
        langTools.addCompleter({
          identifierRegexps: [/[@]/],
          getCompletions (editor, session, pos, prefix, callback) {
            if (prefix.length === 0) { callback(null, []); return }
            callback(null, MockSnippets.map((item) => {
             return { name: item.value, value: item.value, score: item.value, meta: item.name }
            }))
          }
        })
        this.setValue(this.currentValue)
        this.editor.on('change', this.onChange)
      },
      onChange () {
        this.currentValue = this.editor.getValue()
      },
      formatJson (json) {
        try {
          return json5.stringify(json5.parse(json), null, 2)
        } catch (err) {
          return json
        }
      },
      format (data) {
        if (typeof data === 'string') {
          return this.formatJson(data)
        } else if (typeof data === 'object') {
          return JSON.stringify(data, null, '  ')
        } else {
          return data.toString()
        }
      },
      setValue (val) {
        if (val) {
          this.editor.setValue(this.format(val))
          this.editor.clearSelection()
        }
      },
      getValue () {
        return this.currentValue
      },
      getMockValue () {
        let mockValue = ''
        try {
          const val = json5.parse(this.currentValue)
          const mockValueFun = () => Mock.mock(val)
          mockValue = this.format(mockValueFun())
          console.info(mockValue)
        } catch (e) {
          mockValue = `解析出错：${e.message}`
        }
        return mockValue
      }
    },
    mounted () {
      this.currentValue = this.value
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
