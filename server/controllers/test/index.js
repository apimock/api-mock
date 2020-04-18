import { Controller, Route } from '~/server/core/decorator'
const { VM } = require('vm2')
const Mock = require('mockjs')
const testJSON = require('./test.json')

@Controller('/mock')
class Api {
  @Route('get', '/12345678999/test/test', { auth: false })
  test(ctx) {
    const api = {
      mode: JSON.stringify(testJSON)
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

export default Api
