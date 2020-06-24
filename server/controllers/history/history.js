import HistoryProxy from '~/server/provider/history'
// import ProjectProxy from '@server/provider/project'
import { getPage } from '@server/utils'
const defaultPageSize = require('config').get('pageSize')
const Model = require('~/server/models')()

export default class Category {
  static async list (ctx) {
    const projectId = ctx.checkQuery('project_id').notEmpty().value
    const pageSize = ctx.checkQuery('pageSize').empty().toInt().gt(0).default(defaultPageSize).value
    const pageNo = ctx.checkQuery('pageNo').empty().toInt().gt(0).default(1).value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const query = {
      where: {
        type_id: projectId
      },
      include: {
        model: Model.User,
        attributes: { exclude: ['password'] }
      }
    }

    const historyResult = await HistoryProxy.findAndCountAll(query)
    const page = getPage(historyResult, pageSize, pageNo)
    const bean = {
      data: historyResult.rows,
      ...page
    }
    ctx.body = ctx.util.resuccess(bean)
  }
}
