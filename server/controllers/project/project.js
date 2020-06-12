import ProjectProxy from '~/server/provider/project'
import ProjectUserProxy from '~/server/provider/userProject'
import MockProxy from '~/server/provider/mock'
import CategoryProxy from '~/server/provider/category'
import dateTime from '~/server/utils/dateTime'
import { getPage } from '~/server/utils'
const _ = require('lodash')
const Op = require('sequelize').Op
const defaultPageSize = require('config').get('pageSize')
const Model = require('~/server/models')()

export default class Project {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const { description } = ctx.request.body
    const name = ctx.checkBody('name').notEmpty().value
    const baseUrl = ctx.checkBody('base_url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const members = ctx.checkBody('members').empty().type('array').value || []
    const swaggerUrl = ctx.checkBody('swagger_url').empty().isUrl(null, { allow_underscores: true, require_protocol: true }).value

    if (members && members.length) {
      if (_.includes(members, uid)) {
        ctx.body = ctx.util.refail('项目成员不能包含自己')
        return
      }
    }

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }
    const findQuery = { uid, [Op.or]: [{ name }, { base_url: baseUrl }] }
    const project = await ProjectProxy.findOne(findQuery)

    if (project) {
      ctx.body = project.name === name
        ? ctx.util.refail(`项目 ${name} 已存在`)
        : ctx.util.refail('请检查 URL 是否已经存在')
      return
    }

    const res = await ProjectProxy.save({ uid, name, description, members, base_url: baseUrl, swagger_url: swaggerUrl })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async update (ctx) {
    const uid = ctx.state.user.id
    const { description } = ctx.request.body
    const id = ctx.checkBody('id').notEmpty().value
    const name = ctx.checkBody('name').notEmpty().value
    const baseUrl = ctx.checkBody('base_url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const members = ctx.checkBody('members').empty().type('array').value || []
    const swaggerUrl = ctx.checkBody('swagger_url').empty().isUrl(null, { allow_underscores: true, require_protocol: true }).value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.checkById(id, uid)
    let diffMembers = _.difference(project.members, members)
    if (diffMembers.length > 0) {
      await ProjectUserProxy.destroy({
        project_id: project.id,
        uid: {
          [Op.in]: diffMembers
        }
      })
    }

    diffMembers = _.difference(members, project.members)
    if (diffMembers.length > 0) {
      const userProjectAll = diffMembers.map(uid => ({ uid, project_id: id, created_at: dateTime() }))
      await ProjectUserProxy.bulkCreate(userProjectAll)
    }

    if (typeof project === 'string') {
      ctx.body = ctx.util.refail(project)
      return
    }

    if (members && members.length) {
      if (project.uid && _.includes(members, project.uid)) {
        ctx.body = ctx.util.refail('项目成员不能包含创建者')
        return
      }
    }

    const findQuery = { id: { [Op.ne]: project.id }, [Op.or]: [{ name }, { base_url: baseUrl }] }
    const existProject = await ProjectProxy.findOne(findQuery)

    if (existProject) {
      ctx.body = existProject.name === name
        ? ctx.util.refail(`项目 ${name} 已存在`)
        : ctx.util.refail('请检查 URL 是否已经存在')
      return
    }

    const res = await ProjectProxy.save({ id, uid, name, description, members, base_url: baseUrl, swagger_url: swaggerUrl })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async list (ctx) {
    const uid = ctx.state.user.id
    const { keywords } = ctx.query
    const pageSize = ctx.checkQuery('pageSize').empty().toInt().gt(0).default(defaultPageSize).value
    const pageNo = ctx.checkQuery('pageNo').empty().toInt().gt(0).default(1).value
    const source = ctx.checkQuery('source').empty().toInt().default(0).value // 0：全部、1：我创建的、2：我加入的

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const query = {
      where: {
        uid
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

    if (source === 0) {
      const projectIds = await ProjectUserProxy.findProjectIdByUserId(uid)
      query.where = {
        id: {
          [Op.in]: projectIds
        }
      }
    } else if (source === 2) {
      const projectIds = await ProjectUserProxy.findProjectIdByUserId(uid)
      query.where = {
        id: {
          [Op.in]: projectIds
        },
        uid: {
          [Op.ne]: [uid]
        }
      }
    }

    if (keywords) {
      const kw = { [Op.substring]: keywords }
      query.where = {
        [Op.and]: [
          {
            [Op.or]: [
              { base_url: kw },
              { description: kw },
              { name: kw }
            ]
          }
        ]
      }
    }

    const projectResult = await ProjectProxy.findAndCountAll(query)
    const page = getPage(projectResult, pageSize, pageNo)
    const projects = projectResult.rows
    const bean = {
      data: projects,
      ...page
    }
    ctx.body = ctx.util.resuccess(bean)
  }

  static async getById (ctx) {
    const id = ctx.checkParams('id').notEmpty().value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.findOne({ id })
    if (project) {
      ctx.body = ctx.util.resuccess(project)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async delete (ctx) {
    const uid = ctx.state.user.id
    const id = ctx.checkBody('id').notEmpty().value
    const project = await ProjectProxy.findOne({ id })
    if (!project) {
      ctx.body = ctx.util.refail('项目不存在')
      return
    }

    if (project.uid !== uid) {
      ctx.body = ctx.util.refail('无权限')
      return
    }

    const where = { project_id: id }
    await MockProxy.destroy(where)
    await CategoryProxy.destroy(where)
    await ProjectUserProxy.destroy(where)
    const res = ProjectProxy.destroy(id)
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
