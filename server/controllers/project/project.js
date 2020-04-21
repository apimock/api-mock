import ProjectProxy from '~/server/provider/project'
const _ = require('lodash')
const Op = require('sequelize').Op
const defaultPageSize = require('config').get('pageSize')

export default class Project {
  static async create (ctx) {
    const uid = ctx.state.user.id
    const { description }= ctx.request.body
    const name = ctx.checkBody('name').notEmpty().value
    const baseUrl = ctx.checkBody('base_url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    let members = ctx.checkBody('members').empty().type('array').value
    if (members && members.length) {
      if (_.includes(members, uid)) {
        ctx.body = ctx.util.refail('项目成员不能包含自己')
        return
      }
      members = members.join(',')
    }

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

  static async update (ctx) {
    const uid = ctx.state.user.id
    const { description }= ctx.request.body
    const id = ctx.checkBody('id').notEmpty().value
    const name = ctx.checkBody('name').notEmpty().value
    const baseUrl = ctx.checkBody('base_url').notEmpty().match(/^\/.*$/i, 'URL 必须以 / 开头').value
    let members = ctx.checkBody('members').empty().type('array').value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.checkById(id, uid)
    if (typeof project === 'string') {
      ctx.body = ctx.util.refail(project)
      return
    }

    if (members && members.length) {
      if (project.uid && _.includes(members, project.uid)) {
        ctx.body = ctx.util.refail('项目成员不能包含创建者')
        return
      }
      members = members.join(',')
    }

    const findQuery = {id: {[Op.ne]: project.id}, [Op.or]: [{ name }, { base_url: baseUrl }] }
    const existProject = await ProjectProxy.findOne(findQuery)

    if (existProject) {
      ctx.body = existProject.name === name
        ? ctx.util.refail(`项目 ${name} 已存在`)
        : ctx.util.refail('请检查 URL 是否已经存在')
      return
    }

    const res = await ProjectProxy.save({id, uid, name, description, members, base_url:baseUrl})
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }

  }

  static async list (ctx) {
    // const uid = ctx.state.user.id
    const { keywords } = ctx.query
    const pageIndex = ctx.checkQuery('pageIndex').empty().toInt().gt(0).default(1).value
    const pageSize = ctx.checkQuery('pageSize').empty().toInt().gt(0).default(defaultPageSize).value
    console.info(keywords, pageIndex, pageSize)

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const projects = await ProjectProxy.findAll({
      where: {
        uid: 85
      },
      offset: pageSize * (pageIndex - 1),
      limit: pageSize,
      order: [
        ['created_at', 'ASC']
      ]
    })
    ctx.body = ctx.util.resuccess(projects)
  }
}
