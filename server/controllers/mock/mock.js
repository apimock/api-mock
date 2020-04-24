import MockProxy from '~/server/provider/mock'
import ProjectProxy from '~/server/provider/project'
import { Method } from '~/utils/enum'

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

    await MockProxy.save({ uid, project_id: projectId, url: mockURL, method: methodCode, rule, delay, description})
    ctx.body = ctx.util.resuccess()
  }
}
