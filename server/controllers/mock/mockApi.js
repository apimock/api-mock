import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import ExpectProxy from '~/server/provider/expect'
import { Method } from '~/server/utils/enum'
import { getMockValue } from '~/common/mock'
import { delay, json5Parse, zipKeyValue } from '~/server/utils'
const { VM } = require('vm2')
const Mock = require('mockjs')
const _ = require('lodash')
const cookie = require('cookie-parse')

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
      if (item.key === null || item.key === undefined) return
      item._name = list.name

      if (list.name === 'query' && !query[item.key]) {
        errorParams.push(item)
      }
      if (!['get', 'head', 'options'].includes(method) && list.name === 'body' && !body[item.key]) {
        errorParams.push(item)
      }
      if (list.name === 'headers' && !headers[item.key.toLowerCase()]) {
        errorParams.push(item)
      }
    })
    if (errorParams.length) {
      errMsg = `必选参数[${errorParams[0]._name}]:'${errorParams[0].key}'未传值。 Required parameter [${errorParams[0]._name}]: '${errorParams[0].key}' has no value. `
    }
  })
  return errMsg
}

async function getExpects (ctx, mock) {
  const matchList = []
  const params = { ...ctx.query, ...ctx.request.body }
  const expects = await ExpectProxy.findAll({ mock_id: mock.id, enable: 1 })

  for (const item of expects) {
    if (item.id === mock.default_expect_id) {
      matchList.push(item)
      break
    }

    const itemParams = zipKeyValue(item.params)
    if (_.isEqual(params, itemParams)) {
      matchList.push(item)
    }
  }

  return matchList
}

function setHeaders (ctx, headers) {
  if (!Array.isArray(headers)) {
    try {
      headers = JSON.parse(headers)
    } catch (e) {
      headers = []
    }
  }
  if (!headers.length) return

  headers.forEach((item) => {
    if (item.key === 'Set-Cookie') {
      const cookies = cookie.parse(item.value)
      if (!cookies || typeof cookies !== 'object' || !Object.keys(cookies).length) return
      const ignoreKeys = ['Max-Age', 'Expires', 'Path', 'Domain', 'Secure', 'HttpOnly', 'SameSite']
      for (const key in cookies) {
        if (cookies.hasOwnProperty(key)) {
          if (ignoreKeys.includes(key)) break
          ctx.cookies.set(key, cookies[key], {
            maxAge: 864000000,
            httpOnly: false
          })
        }
      }
    } else {
      ctx.set(item.key, item.value)
    }
  })
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
      setHeaders(ctx, expect.headers)
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
