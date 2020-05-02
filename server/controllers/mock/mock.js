import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import { Method } from '~/server/utils/enum'
const Op = require('sequelize').Op
const defaultPageSize = require('config').get('pageSize')

export default class Mock {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const projectId = ctx.checkBody('project_id').notEmpty().value
    const url = ctx.checkBody('url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const method = ctx.checkBody('method').notEmpty().toLow().in(['get', 'post', 'put', 'delete', 'patch']).value
    const rule = ctx.checkBody('rule').notEmpty().value
    const delay = ctx.checkBody('delay').empty().toInt().default(0).value
    const description = ctx.checkBody('description').notEmpty().value
    const mockURL = decodeURIComponent(url)
    const methodCode = Method[method]

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.checkById(projectId, uid)
    if (typeof project === 'string') {
      ctx.body = ctx.util.refail(project)
      return
    }

    const mock = await MockProxy.findOne({
      project_id: projectId,
      url: mockURL,
      method: methodCode
    })

    if (mock) {
      ctx.body = ctx.util.refail('请检查接口是否已经存在')
      return
    }

    await MockProxy.save({ uid, project_id: projectId, url: mockURL, method: methodCode, rule, delay, description })
    ctx.body = ctx.util.resuccess()
  }

  static async update (ctx) {
    const uid = ctx.state.user.id
    const id = ctx.checkBody('id').notEmpty().value
    const url = ctx.checkBody('url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const method = ctx.checkBody('method').notEmpty().toLow().in(['get', 'post', 'put', 'delete', 'patch']).value
    const rule = ctx.checkBody('rule').notEmpty().value
    const delay = ctx.checkBody('delay').empty().toInt().default(0).value
    const description = ctx.checkBody('description').notEmpty().value
    const mockURL = decodeURIComponent(url)
    const methodCode = Method[method]

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const mock = await MockProxy.checkById(id, uid)
    if (typeof mock === 'string') {
      ctx.body = ctx.util.refail(mock)
      return
    }

    const res = await MockProxy.save({ id, uid, url: mockURL, method: methodCode, rule, delay, description })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async list (ctx) {
    // const uid = ctx.state.user.id
    const keywords = ctx.query.keywords
    const projectSign = ctx.checkQuery('project_sign').notEmpty().value
    const pageSize = ctx.checkQuery('pageSize').empty().toInt().gt(0).default(defaultPageSize).value
    const pageNo = ctx.checkQuery('pageNo').empty().toInt().gt(0).default(1).value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.findOne({ sign: projectSign })
    if (!project) {
      ctx.throw(404)
      return
    }

    const query = {
      where: {
        project_id: project.id
      },
      offset: pageSize * (pageNo - 1),
      limit: pageSize,
      order: [
        ['created_at', 'DESC']
      ]
    }

    if (keywords) {
      const kw = { [Op.substring]: keywords }
      query.where = Object.assign(query.where, {
        [Op.and]: [
          {
            [Op.or]: [
              { url: kw },
              { description: kw },
              { rule: kw }
            ]
          }
        ]
      })
    }

    const mocks = await MockProxy.findAll(query)
    const bean = {
      data: mocks,
      project,
      pageSize,
      pageNo,
      totalPage: 6,
      totalCount: 57
    }
    ctx.body = ctx.util.resuccess(bean)
  }
}
