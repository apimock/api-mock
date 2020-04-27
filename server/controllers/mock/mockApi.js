import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import { Method } from '~/server/utils/enum'
import { params } from '~/server/utils'
const { VM } = require('vm2')
const Mock = require('mockjs')

export default class MockApi {
  static async getApi (ctx) {
    // const { query, body } = ctx.request
    const method = ctx.method.toLowerCase()
    const projectSign = ctx.pathNode.projectSign
    let { mockURL } = ctx.pathNode
    mockURL = decodeURIComponent(mockURL)
    const project = await ProjectProxy.findOne({ sign: projectSign })
    if (!project) {
      ctx.throw(404)
      return
    }
    const url = mockURL.replace(project.base_url, '') || '/'
    const methodCode = Method[method]
    const mock = await MockProxy.findOne({
      url,
      method: methodCode
    })
    if (!mock) ctx.throw(404)

    Mock.Handler.function = function (options) {
      const mockUrl = mock.url.replace(/{/g, ':').replace(/}/g, '') // /api/{user}/{id} => /api/:user/:id
      options.Mock = Mock
      options._req = ctx.request
      options._req.params = params(mockUrl, url)
      options._req.cookies = ctx.cookies.get.bind(ctx)
      return options.template.call(options.context.currentContext, options)
    }

    const vm = new VM({
      timeout: 1000,
      sandbox: {
        Mock,
        rule: mock.rule,
        template: new Function(`return ${mock.rule}`) // eslint-disable-line
      }
    })

    vm.run('Mock.mock(new Function("return " + rule)())') // 数据验证，检测 setTimeout 等方法
    const apiData = vm.run('Mock.mock(template())') // 解决正则表达式失效的问题

    ctx.body = apiData
  }
}
