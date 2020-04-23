import MockProxy from '~/server/provider/mock'

export default class Mock {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const projectId = ctx.checkBody('project_id').notEmpty().value
    const url = ctx.checkBody('url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    const method = ctx.checkBody('method').notEmpty().toLow().in(['get', 'post', 'put', 'delete', 'patch']).value
    const rule = ctx.checkBody('rule').notEmpty().value
    const delay = ctx.checkBody('delay').empty().toInt().default(0).value
    const description = ctx.checkBody('description').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }
    await MockProxy.save({ uid, project_id: projectId, url, method, rule, delay, description})
    ctx.body = ctx.util.resuccess()
  }
}
