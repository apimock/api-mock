import { Controller, Route } from '@core/decorator'
const { VM } = require('vm2')
const Mock = require('mockjs')

@Controller('/api')
class Test {
  @Route('get', '/mock', { auth: false })
  login(ctx) {
    const api = {
      mode: `{
          // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
          'list|1-10': [{
              // 属性 id 是一个自增数，起始值为 1，每次增 1
              'id|+1': 1
          }]
        }`
    }
    const vm = new VM({
      timeout: 1000,
      sandbox: {
        Mock,
        mode: api.mode,
        template: new Function(`return ${api.mode}`) // eslint-disable-line
      }
    })
    vm.run('Mock.mock(new Function("return " + mode)())') // 数据验证，检测 setTimeout 等方法
    const apiData = vm.run('Mock.mock(template())') // 解决正则表达式失效的问题
    ctx.body = apiData
  }
}

export default Test
