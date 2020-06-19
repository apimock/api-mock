import ProjectProxy from '~/server/provider/project'
import MemberProxy from '~/server/provider/member'
import MockProxy from '~/server/provider/mock'
import CategoryProxy from '~/server/provider/category'
import { getPage } from '~/server/utils'
import UserProxy from '@server/provider/user'
const Op = require('sequelize').Op
const defaultPageSize = require('config').get('pageSize')
const Model = require('~/server/models')()

export default class Project {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const { description } = ctx.request.body
    const name = ctx.checkBody('name').notEmpty().value
    const baseUrl = ctx.checkBody('base_url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const swaggerUrl = ctx.checkBody('swagger_url').empty().isUrl(null, { allow_underscores: true, require_protocol: true }).value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }
    const where = { uid, [Op.or]: [{ name }, { base_url: baseUrl }] }
    const project = await ProjectProxy.findOne(where)

    if (project) {
      ctx.body = project.name === name
        ? ctx.util.refail(`项目 ${name} 已存在`)
        : ctx.util.refail('请检查 URL 是否已经存在')
      return
    }

    const res = await ProjectProxy.save({ uid, name, description, base_url: baseUrl, swagger_url: swaggerUrl })
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
    const swaggerUrl = ctx.checkBody('swagger_url').empty().isUrl(null, { allow_underscores: true, require_protocol: true }).value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.checkById(id, uid)

    if (typeof project === 'string') {
      ctx.body = ctx.util.refail(project)
      return
    }

    const where = { id: { [Op.ne]: project.id }, [Op.or]: [{ name }, { base_url: baseUrl }] }
    const existProject = await ProjectProxy.findOne(where)

    if (existProject) {
      ctx.body = existProject.name === name
        ? ctx.util.refail(`项目 ${name} 已存在`)
        : ctx.util.refail('请检查 URL 是否已经存在')
      return
    }

    const res = await ProjectProxy.save({ id, uid, name, description, base_url: baseUrl, swagger_url: swaggerUrl })
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
    const source = ctx.checkQuery('source').empty().toInt().default(0).value // 0：全部、1：我创建的、2：我加入的、3：我的收藏

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const stars = await UserProxy.getStars(uid, 'star_project')

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
      const projectIds = await MemberProxy.findProjectIdByUserId(uid)
      query.where = {
        id: {
          [Op.in]: projectIds
        }
      }
    } else if (source === 2) {
      const projectIds = await MemberProxy.findProjectIdByUserId(uid)
      query.where = {
        id: {
          [Op.in]: projectIds
        },
        uid: {
          [Op.ne]: [uid]
        }
      }
    } else if (source === 3) {
      query.where = {
        id: {
          [Op.in]: stars
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
    projects.forEach((item) => {
      let hadStar = false
      if (stars.includes(item.id)) hadStar = true
      item.dataValues.hadStar = hadStar
    })
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
    await MemberProxy.destroy(where)
    const res = ProjectProxy.destroy(id)
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
