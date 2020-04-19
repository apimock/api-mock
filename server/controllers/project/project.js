import ProjectProxy from '~/server/provider/project'

export default class Project {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const { description }= ctx.request.body
    const name = ctx.checkBody('name').notEmpty().value
    const members = ctx.checkBody('members').empty().type('array').value
    const baseUrl = ctx.checkBody('base_url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const res = await ProjectProxy.save({uid, name, description, members, base_url:baseUrl})
    if (res) {
      ctx.body = ctx.util.resuccess()
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
