import MemberProxy from '~/server/provider/member'
import ProjectProxy from '@server/provider/project'
import UserProxy from '@server/provider/user'
const Model = require('~/server/models')()

export default class Member {
  static async create (ctx) {
    const username = ctx.checkBody('username').notEmpty().value
    const projectId = ctx.checkBody('project_id').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const user = await UserProxy.findByUserName(username)
    if (!user) {
      ctx.body = ctx.util.refail('用户不存在！')
      return
    }

    const project = await ProjectProxy.findOne({ id: projectId })

    if (!project) {
      ctx.body = ctx.util.refail('项目不存在')
      return
    }

    const member = await MemberProxy.findOne({ uid: user.id, project_id: projectId })
    if (member) {
      ctx.body = ctx.util.refail('该成员已存在，不能重复添加！')
      return
    }

    const res = await MemberProxy.save({ uid: user.id, project_id: projectId })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async list (ctx) {
    // const uid = ctx.state.user.id
    const projectId = ctx.checkQuery('project_id').notEmpty().value
    const query = {
      where: {
        project_id: projectId
      },
      include: {
        model: Model.User,
        attributes: { exclude: ['password'] }
      }
    }
    const res = await MemberProxy.findAll(query)
    if (res) {
      ctx.body = ctx.util.resuccess({
        data: res
      })
    } else {
      ctx.body = ctx.util.refail()
    }
  }

  static async delete (ctx) {
    // const userId = ctx.state.user.id
    const uid = ctx.checkBody('uid').notEmpty().value
    const projectId = ctx.checkBody('project_id').notEmpty().value

    if (ctx.errors) {
      ctx.body = ctx.util.refail(null, 10001, ctx.errors)
      return
    }

    const project = await ProjectProxy.findOne({ id: projectId })

    if (!project) {
      ctx.body = ctx.util.refail('项目不存在')
      return
    }

    if (project.uid === uid) {
      ctx.body = ctx.util.refail('无法删除项目创建者！')
      return
    }

    const res = await MemberProxy.destroy({ uid, project_id: projectId })
    if (res) {
      ctx.body = ctx.util.resuccess(res)
    } else {
      ctx.body = ctx.util.refail()
    }
  }
}
