import CategoryProxy from '~/server/provider/category'
import ProjectProxy from '@server/provider/project'
import MockProxy from '@server/provider/mock'
const Model = require('~/server/models')()
const Op = require('sequelize').Op

export default class Category {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const name = ctx.checkBody('name').notEmpty().value
    const description = ctx.checkBody('description').empty().value
    const projectId = ctx.checkBody('project_id').notEmpty().value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.checkById(projectId, uid)
    if (typeof project === 'string') {
      ctx.body = ctx.util.refail(project)
      return
    }

    const res = await CategoryProxy.save({ uid, project_id: projectId, name, description })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async list (ctx) {
    const projectId = ctx.checkQuery('project_id').notEmpty().value
    const keywords = ctx.checkQuery('keywords').empty().value
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
      include: {
        model: Model.Mock,
        as: 'children'
      }
    }

    if (keywords) {
      const kw = { [Op.substring]: keywords }
      query.include = {
        model: Model.Mock,
        as: 'children',
        where: {
          [Op.or]: [
            { url: kw },
            { name: kw }
          ]
        }
      }
    }

    const categoryResult = await CategoryProxy.findAll(query)
    ctx.body = ctx.util.resuccess(categoryResult)
  }

  static async getById (ctx) {
    const id = ctx.checkParams('id').notEmpty().value
    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const category = await CategoryProxy.findOne({ id })
    if (category) {
      ctx.body = ctx.util.resuccess(category)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async delete (ctx) {
    const uid = ctx.state.user.id
    const id = ctx.checkBody('id').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
    }

    const category = await CategoryProxy.findOne({ id })

    if (!category) {
      ctx.body = ctx.util.refail('接口不存在')
      return
    }

    if (category.uid !== uid) {
      ctx.body = ctx.util.refail('无权限')
      return
    }

    await MockProxy.destroy({ category_id: id })
    const res = await CategoryProxy.destroy({ id })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
