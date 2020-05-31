import ExpectProxy from '~/server/provider/expect'
import MockProxy from '@server/provider/mock'
import { getPage } from '@server/utils'
const defaultPageSize = require('config').get('pageSize')
const Model = require('~/server/models')()

export default class Expect {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const name = ctx.checkBody('name').notEmpty().value
    const mockId = ctx.checkBody('mock_id').notEmpty().value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const mock = await MockProxy.checkById(mockId, uid)
    if (typeof mock === 'string') {
      ctx.body = ctx.util.refail(mock)
      return
    }

    const res = await ExpectProxy.save({ uid, mock_id: mockId, name })
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
      offset: pageSize * (pageNo - 1),
      limit: pageSize,
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
