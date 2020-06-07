import ExpectProxy from '~/server/provider/expect'
import MockProxy from '@server/provider/mock'
import { getPage, keyValueToStr } from '@server/utils'
const defaultPageSize = require('config').get('pageSize')
const Model = require('~/server/models')()

export default class Expect {
  static async createOrUpdate (ctx, update = false) {
    const uid = ctx.state.user.id
    const name = ctx.checkBody('name').notEmpty().value
    const mockId = ctx.checkBody('mock_id').notEmpty().value
    let params = ctx.checkBody('params').empty().value
    let headers = ctx.checkBody('headers').empty().value
    const delay = ctx.checkBody('delay').empty().toInt().ge(0, 'Response Delay must between (0, 180000)').le(180000, 'Response Delay must between (0, 180000)').default(0).value
    const status = ctx.checkBody('status').empty().toInt().ge(100, 'Response Status must between 1 (100, 511)').le(511, 'Response Status must between 2 (100, 511)').default(200).value
    const body = ctx.checkBody('body').empty().value
    const enable = ctx.checkBody('enable').empty().value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    params = keyValueToStr(params)
    headers = keyValueToStr(headers)

    const mock = await MockProxy.checkById(mockId, uid)
    if (typeof mock === 'string') {
      ctx.body = ctx.util.refail(mock)
      return
    }
    let res = null
    if (update) {
      const id = ctx.request.body.id
      if (!id) {
        ctx.body = ctx.util.refail(null, 10001, 'id不能为空！')
        return
      }
      res = await ExpectProxy.save({ id, uid, mock_id: mockId, name, params, delay, status, headers, body, enable })
    } else {
      res = await ExpectProxy.save({ uid, mock_id: mockId, name, params, delay, status, headers, body, enable })
    }

    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async delete (ctx) {
    const uid = ctx.state.user.id
    const id = ctx.checkBody('id').notEmpty().value
    const mockId = ctx.checkBody('mock_id').notEmpty().value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const expect = await ExpectProxy.findOne({ id, mock_id: mockId })

    if (!expect) {
      ctx.body = ctx.util.refail('记录不存在！')
      return
    }

    if (expect.uid !== uid) {
      ctx.body = ctx.util.refail('无权限删除！')
      return
    }

    const res = await ExpectProxy.remove({ id, mock_id: mockId })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async list (ctx) {
    const mockId = ctx.checkQuery('mock_id').notEmpty().value
    const pageSize = ctx.checkQuery('pageSize').empty().toInt().gt(0).default(defaultPageSize).value
    const pageNo = ctx.checkQuery('pageNo').empty().toInt().gt(0).default(1).value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const mock = await MockProxy.findOne({ id: mockId })
    if (!mock) {
      ctx.throw(404)
      return
    }

    const query = {
      where: {
        mock_id: mock.id
      },
      // offset: pageSize * (pageNo - 1),
      // limit: pageSize,
      include: {
        model: Model.User,
        attributes: { exclude: ['password'] }
      }
    }
    const ExpectResult = await ExpectProxy.findAndCountAll(query)
    const page = getPage(ExpectResult, pageSize, pageNo)
    const expects = ExpectResult.rows
    const bean = {
      data: expects,
      ...page
    }
    ctx.body = ctx.util.resuccess(bean)
  }
}
