import CategoryProxy from '~/server/provider/category'
import ProjectProxy from '@server/provider/project'
const Model = require('~/server/models')()

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
    const categoryResult = await CategoryProxy.findAll(query)
    ctx.body = ctx.util.resuccess(categoryResult)
  }
}
