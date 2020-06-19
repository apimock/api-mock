import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import ExpectProxy from '~/server/provider/expect'
import UserProxy from '~/server/provider/user'
import { Method } from '~/server/utils/enum'
import { getPage, keyValueToStr } from '~/server/utils'
const Op = require('sequelize').Op
const defaultPageSize = require('config').get('pageSize')
const Model = require('~/server/models')()

export default class Mock {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const projectId = ctx.checkBody('project_id').notEmpty().value
    const categoryId = ctx.checkBody('category_id').notEmpty().value
    const url = ctx.checkBody('url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const method = ctx.checkBody('method').notEmpty().toLow().in(['get', 'post', 'put', 'delete', 'patch', 'options', 'head']).value
    const body = ctx.checkBody('body').notEmpty().value
    const delay = ctx.checkBody('delay').empty().toInt().ge(0, 'Response Delay must between (0, 180000)').le(180000, 'Response Delay must between (0, 180000)').default(0).value
    const status = ctx.checkBody('status').empty().toInt().ge(100, 'Response Status must between 1 (100, 511)').le(511, 'Response Status must between 2 (100, 511)').default(200).value
    const name = ctx.checkBody('name').notEmpty().value
    let headers = ctx.checkBody('headers').empty().value
    let queryParams = ctx.checkBody('query_params').empty().value
    let bodyParams = ctx.checkBody('body_params').empty().value
    const bodyParamsType = ctx.checkBody('body_params_type').empty().value
    const mockURL = decodeURIComponent(url)
    const methodCode = Method[method]

    headers = keyValueToStr(headers)
    queryParams = keyValueToStr(queryParams)
    bodyParams = keyValueToStr(bodyParams)

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

    const res = await MockProxy.save({ uid, project_id: projectId, category_id: categoryId, url: mockURL, method: methodCode, headers, query_params: queryParams, body_params: bodyParams, body_params_type: bodyParamsType, body, delay, status, name })

    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async update (ctx) {
    const uid = ctx.state.user.id
    const id = ctx.checkBody('id').notEmpty().value
    const categoryId = ctx.checkBody('category_id').empty().value
    const defaultExpectId = ctx.checkBody('default_expect_id').empty().value
    const url = ctx.checkBody('url').empty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const method = ctx.checkBody('method').empty().toLow().in(['get', 'post', 'put', 'delete', 'patch', 'options', 'head']).value
    const body = ctx.checkBody('body').empty().value
    const script = ctx.checkBody('script').empty().value
    const enableScript = ctx.checkBody('enable_script').empty().value
    const delay = ctx.checkBody('delay').empty().toInt().ge(0, 'Response Delay must between (0, 180000)').le(180000, 'Response Delay must between (0, 180000)').default(0).value
    const status = ctx.checkBody('status').empty().toInt().ge(100, 'Response Status must between 1 (100, 511)').le(511, 'Response Status must between 2 (100, 511)').default(200).value
    const name = ctx.checkBody('name').empty().value
    let headers = ctx.checkBody('headers').empty().value
    let queryParams = ctx.checkBody('query_params').empty().value
    let bodyParams = ctx.checkBody('body_params').empty().value
    const bodyParamsType = ctx.checkBody('body_params_type').empty().value
    const mockURL = url ? decodeURIComponent(url) : undefined
    const methodCode = Method[method]

    headers = keyValueToStr(headers)
    queryParams = keyValueToStr(queryParams)
    bodyParams = keyValueToStr(bodyParams)

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const mock = await MockProxy.checkById(id, uid)
    if (typeof mock === 'string') {
      ctx.body = ctx.util.refail(mock)
      return
    }

    const res = await MockProxy.save({ id, category_id: categoryId, default_expect_id: defaultExpectId, uid, url: mockURL, method: methodCode, headers, query_params: queryParams, body_params: bodyParams, body_params_type: bodyParamsType, body, script, enable_script: enableScript, delay, status, name })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async list (ctx) {
    const keywords = ctx.query.keywords
    const projectId = ctx.checkQuery('project_id').notEmpty().value
    const categoryId = ctx.checkQuery('category_id').empty().value
    const pageSize = ctx.checkQuery('pageSize').empty().toInt().gt(0).default(defaultPageSize).value
    const pageNo = ctx.checkQuery('pageNo').empty().toInt().gt(0).default(1).value
    const sortField = ctx.checkQuery('sortField').empty().value
    const sortOrder = ctx.checkQuery('sortOrder').empty().value
    const methods = ctx.query['method[]']

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.findOne({ id: projectId })
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
      ],
      include: {
        model: Model.User,
        attributes: { exclude: ['password'] }
      }
    }

    if (categoryId && categoryId !== 'all') {
      Object.assign(query.where, {
        [Op.and]: {
          category_id: categoryId
        }
      })
    }

    if (categoryId && categoryId === 'star') {
      const uid = ctx.state.user.id
      const stars = await UserProxy.getStars(uid, 'star_mock')
      if (stars.length) {
        Object.assign(query.where, {
          [Op.and]: {
            id: {
              [Op.in]: stars
            }
          }
        })
      }
    }

    if (sortField && sortOrder) {
      const order = sortOrder.replace(/end$/, '')
      query.order.unshift([sortField, order])
    }
    if (methods && methods.length > 0) {
      Object.assign(query.where, {
        [Op.and]: [
          {
            method: {
              [Op.or]: [methods]
            }
          }
        ]
      })
    }

    if (keywords) {
      const kw = { [Op.substring]: keywords }
      query.where = Object.assign(query.where, {
        [Op.and]: [
          {
            [Op.or]: [
              { url: kw },
              { name: kw },
              { body: kw }
            ]
          }
        ]
      })
    }

    const mockResult = await MockProxy.findAndCountAll(query)
    const page = getPage(mockResult, pageSize, pageNo)
    const mocks = mockResult.rows
    const bean = {
      data: mocks,
      project,
      ...page
    }
    ctx.body = ctx.util.resuccess(bean)
  }

  static async detail (ctx) {
    // const projectId = ctx.checkQuery('project_id').notEmpty().value
    const uid = ctx.state.user.id
    const id = ctx.checkQuery('id').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }
    const query = {
      where: {
        id
      },
      include: {
        model: Model.User,
        attributes: { exclude: ['password'] }
      }
    }
    const mock = await MockProxy.findOne(query)
    if (!mock) {
      ctx.body = ctx.util.refail('接口不存在！')
      return
    }

    const expectCount = await ExpectProxy.count({ mock_id: mock.id })
    const stars = await UserProxy.getStars(uid, 'star_mock')
    let hadStar = false
    if (stars.includes(mock.id)) hadStar = true
    mock.dataValues.hadStar = hadStar
    mock.dataValues.expect_count = expectCount
    ctx.body = ctx.util.resuccess(mock)
  }

  static async delete (ctx) {
    const uid = ctx.state.user.id
    const id = ctx.checkBody('id').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const mock = await MockProxy.findOne({ id })

    if (!mock) {
      ctx.body = ctx.util.refail('接口不存在')
      return
    }

    if (mock.uid !== uid) {
      ctx.body = ctx.util.refail('无权限')
      return
    }

    const res = await MockProxy.destroy({ id })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async copy (ctx) {
    // const uid = ctx.state.user.id
    const id = ctx.checkQuery('id').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const mock = await MockProxy.findOne({ id })

    if (!mock) {
      ctx.body = ctx.util.refail('接口不存在')
      return
    }

    const dataValues = mock.dataValues
    const data = {
      uid: dataValues.uid,
      project_id: dataValues.project_id,
      category_id: dataValues.category_id,
      name: `${dataValues.name}_copy`,
      url: `${dataValues.url}_copy_${Date.now()}`,
      method: dataValues.method,
      body: dataValues.body
    }

    const res = await MockProxy.save(data)
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
