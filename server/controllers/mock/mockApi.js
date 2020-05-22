import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import { Method } from '~/server/utils/enum'
import { params, delay, json5Parse } from '~/server/utils'
const { VM } = require('vm2')
const Mock = require('mockjs')

function checkRequest (lists, ctx, method) {
  const errorParams = []
  const { query, body, headers } = ctx.request
  let errMsg = ''
  lists.map((list) => {
    if (!list.data || !list.data.length) {
      return
    }
    const data = json5Parse(list.data)
    data.filter((item) => {
      return !!item.required
    }).map((item) => {
      if (list.name === 'query' && !query[item.name]) {
        errorParams.push(item)
      }
      if (!['get', 'head', 'options'].includes(method) && list.name === 'body' && !body[item.name]) {
        errorParams.push(item)
      }
      if (list.name === 'headers' && !headers[item.name.toLowerCase()]) {
        errorParams.push(item)
      }
    })
    if (errorParams.length) {
      errMsg = `必选参数${errorParams[0].name}未传值。 Required parameter ${errorParams[0].name} has no value. `
    }
  })
  return errMsg
}

export default class MockApi {
  static async getApi (ctx) {
    console.info(ctx.request.type, 'rest type')
    const method = ctx.method.toLowerCase()
    const projectId = ctx.pathNode.projectId
    let { mockURL } = ctx.pathNode
    mockURL = decodeURIComponent(mockURL)
    const project = await ProjectProxy.findOne({ id: projectId })
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

    const errMsg = checkRequest([{ name: 'query', data: mock.query_params }, { name: 'body', data: mock.body_params }, { name: 'headers', data: mock.headers }], ctx, method)
    if (errMsg) {
      ctx.body = ctx.util.refail(errMsg, 10001)
      return
    }

    Mock.Handler.function = function (options) {
      const mockUrl = mock.url.replace(/{/g, ':').replace(/}/g, '') // /api/{user}/{id} => /api/:user/:id
      options.Mock = Mock
      options._req = ctx.request
      options._req.params = params(mockUrl, url)
      options._req.cookies = ctx.cookies.get.bind(ctx)
      return options.template.call(options.context.currentContext, options)
    }

    try {
      const vm = new VM({
        timeout: 1000,
        sandbox: {
          Mock,
          body: mock.body,
          template: new Function(`return ${mock.body}`) // eslint-disable-line
        }
      })
      vm.run('Mock.mock(new Function("return " + body)())') // 数据验证，检测 setTimeout 等方法
      const apiData = vm.run('Mock.mock(template())') // 解决正则表达式失效的问题
      if (mock.delay > 0) {
        await delay(mock.delay)
      }
      ctx.body = apiData
      ctx.status = mock.status
    } catch (e) {
      ctx.body = ctx.util.refail('数据解析出错！')
    }
  }
}
