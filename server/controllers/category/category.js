import CategoryProxy from '~/server/provider/category'
import ProjectProxy from '@server/provider/project'
const Model = require('~/server/models')()

export default class Category {
  static async create (ctx) {
    const uid = ctx.state.user.id
    console.info(uid)
  }

  static async list (ctx) {
    const projectSign = ctx.checkQuery('project_sign').notEmpty().value
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
      include: {
        model: Model.Mock
      }
    }
    const categoryResult = await CategoryProxy.findAll(query)
    ctx.body = ctx.util.resuccess(categoryResult)
  }
}
