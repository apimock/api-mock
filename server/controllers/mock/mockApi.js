import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import ExpectProxy from '~/server/provider/expect'
import { Method } from '~/server/utils/enum'
import { getMockValue } from '~/common/mock'
import { delay, json5Parse, zipKeyValue } from '~/server/utils'
const { VM } = require('vm2')
const Mock = require('mockjs')
const _ = require('lodash')

function checkRequest (lists, ctx, method) {
  const errorParams = []
  const { query, body, headers } = ctx.request
  let errMsg = ''
  lists.map((list) => {
    if (!list.data || !list.data.length) {
      return false
    }
    const data = json5Parse(list.data)
    if (!Array.isArray(data)) return false
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

async function getExpects (ctx, mock) {
  const matchList = []
  const params = { ...ctx.query, ...ctx.request.body }
  if (!params || typeof params !== 'object' || !Object.keys(params).length) {
    return matchList
  }
  console.info(params, 'params')
  const expects = await ExpectProxy.findAll({ mock_id: mock.id, enable: 1 })
  expects.forEach((item) => {
    const itemParams = zipKeyValue(item.params)
    if (_.isEqual(params, itemParams)) {
      matchList.push(item)
    }
    console.info(itemParams, 'itemParams')
  })
  return matchList
}

export default class MockApi {
  static async getApi (ctx) {
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
    if (errMsg && typeof errMsg === 'string') {
      ctx.body = ctx.util.refail(errMsg, 10001)
      return
    }

    const expects = await getExpects(ctx, mock)
    if (expects.length) {
      const expect = expects[0]
      const expectValue = getMockValue(expect.body, false)
      if (expect.delay > 0) {
        await delay(expect.delay)
      }
      ctx.body = expectValue
      ctx.status = Number(expect.status)
      return
    }

    const mockValue = getMockValue(mock.body, false)
    // Mock.Handler.function = function (options) {
    //   const mockUrl = mock.url.replace(/{/g, ':').replace(/}/g, '') // /api/{user}/{id} => /api/:user/:id
    //   options.Mock = Mock
    //   options._req = ctx.request
    //   options._req.params = params(mockUrl, url)
    //   options._req.cookies = ctx.cookies.get.bind(ctx)
    //   return options.template.call(options.context.currentContext, options)
    // }

    if (!mock.enable_script) {
      ctx.body = mockValue
      return
    }

    const Api = {
      json: mockValue || {},
      req: ctx.request,
      status: 200,
      delay: 0
    }
    try {
      const sandbox = {
        Api,
        Random: Mock.Random
      }
      const vm = new VM({
        timeout: 1000,
        sandbox
      })
      vm.run(mock.script)
      // console.info(sandbox.Api)

      mock.delay = Number(sandbox.Api.delay)
      if (isNaN(mock.delay)) {
        ctx.body = ctx.util.refail('Api.delay 的值必须为数字！')
        return
      }
      if (isNaN(Number(sandbox.Api.status))) {
        ctx.body = ctx.util.refail('Api.status 的值必须为数字！')
        return
      }
      if (mock.delay > 0) {
        await delay(mock.delay)
      }
      ctx.body = sandbox.Api.json
      ctx.status = Number(sandbox.Api.status)
    } catch (e) {
      ctx.body = ctx.util.refail('数据解析出错！')
    }
  }
}
