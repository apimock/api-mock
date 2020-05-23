<template>
  <div class="ace-editor" ref="editor"></div>
</template>

<script>
  import { MockSnippets } from '@/views/components/editor/mockSnippets'
  import jsBeautify from 'js-beautify/js/lib/beautify'
  const Mock = require('mockjs')
  const json5 = require('json5')
  const ace = require('brace')
  require('brace/mode/javascript')
  require('brace/theme/xcode')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  require('./snippets')
  const Dom = ace.acequire('ace/lib/dom')
  const langTools = ace.acequire('ace/ext/language_tools')
  Mock.Random.extend({
    timestamp: function () {
      const time = new Date().getTime() + ''
      return +time.substr(0, time.length - 3)
    }
  })
  let dataType = 'json'

  export default {
    name: 'AceEditor',
    props: {
      value: {
        type: String,
        default: ''
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      type: {
        default: 'json',
        validator: function (value) {
          return ['json', 'script'].indexOf(value) !== -1
        }
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
      },
      type (val) {
        if (val === 'json') {
          this.editor.setOption('enableSnippets', false)
        } else {
          this.editor.setOption('enableSnippets', true)
        }
        dataType = this.type
      }
    },
    methods: {
      install () {
        this.editor = ace.edit(this.$refs.editor)
        this.editor.$blockScrolling = Infinity
        this.editor.getSession().setMode('ace/mode/javascript')
        this.editor.setTheme('ace/theme/xcode')
        if (this.readOnly) {
          this.editor.setReadOnly(true)
          this.editor.renderer.$cursorLayer.element.style.display = 'none'
        }
        this.editor.setOptions({
          tabSize: 2,
          fontSize: 14,
          enableBasicAutocompletion: true,
          enableSnippets: false, // 启用代码段
          enableLiveAutocompletion: true, // 智能补全
          useWorker: true
        })
        langTools.addCompleter({
          identifierRegexps: [/[@]/],
          getCompletions (editor, session, pos, prefix, callback) {
            if (prefix.length === 0 || dataType === 'script') { callback(null, []); return }
            callback(null, MockSnippets.map((item) => {
             return { name: item.value, value: item.value, score: item.value, meta: item.name }
            }))
          }
        })
        this.setValue(this.currentValue)
        this.editor.on('change', this.onChange)
        this.editor.commands.addCommand({
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            this.$emit('save')
          }
        })
        this.editor.commands.addCommand({
          name: 'Toggle Fullscreen',
          bindKey: 'F9',
          exec: () => {
            const fullScreen = Dom.toggleCssClass(document.body, 'fullscreen')
            Dom.setCssClass(this.editor.container, 'fullscreen', fullScreen)
            this.editor.setAutoScrollEditorIntoView(!fullScreen)
            this.editor.resize()
          }
        })
      },
      onChange () {
        this.currentValue = this.editor.getValue()
        this.$emit('change', this.currentValue)
      },
      formatJson (json) {
        try {
          return JSON.stringify(json5.parse(json), null, 2)
        } catch (err) {
          return json
        }
      },
      jsonToStr (data) {
        if (typeof data === 'string') {
          return this.formatJson(data)
        } else if (typeof data === 'object') {
          return JSON.stringify(data, null, 2)
        } else {
          return data.toString()
        }
      },
      format (value) {
        return jsBeautify.js_beautify(value, { indent_size: 2 })
      },
      insert (code) {
        const pos = this.editor.selection.getCursor()
        this.editor.session.insert(pos, code)
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
          mockValue = this.jsonToStr(mockValueFun())
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
  &.fullscreen{
    height: auto;
    width: auto;
    border: 0;
    margin: 0;
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000000;
  }
}
</style>
