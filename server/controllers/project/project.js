import ProjectProxy from '~/server/provider/project'
const Op = require('sequelize').Op

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
    const findQuery = {uid, [Op.or]: [{ name }, { base_url: baseUrl }] }
    const project = await ProjectProxy.findOne(findQuery)

    if (project) {
      ctx.body = project.name === name
        ? ctx.util.refail(`项目 ${name} 已存在`)
        : ctx.util.refail('请检查 URL 是否已经存在')
      return
    }

    const res = await ProjectProxy.save({uid, name, description, members, base_url:baseUrl})
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
