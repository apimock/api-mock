
<script>
  import jsBeautify from 'js-beautify/js/lib/beautify'
  const ace = require('brace')
  require('brace/mode/javascript')
  require('brace/mode/json')
  require('brace/theme/xcode')
  require('brace/ext/language_tools')
  require('brace/ext/searchbox')
  const Dom = ace.acequire('ace/lib/dom')

  export default {
    props: {
      value: {
        type: String,
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
      value (val) {
        this.currentValue = val
        this.setValue(val)
      }
    },
    methods: {
      install (mode) {
        this.editor = ace.edit(this.$refs.editor)
        this.editor.getSession().setMode(`ace/mode/${mode}`)
        this.editor.$blockScrolling = Infinity
        this.editor.setAutoScrollEditorIntoView(true)
        this.editor.setTheme('ace/theme/xcode')
        if (this.readOnly) {
          this.editor.setReadOnly(true)
          this.editor.renderer.$cursorLayer.element.style.display = 'none'
        }
        this.editor.setOptions({
          tabSize: 2,
          fontSize: 14,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true, // 智能补全
          useWorker: true
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
      }
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
