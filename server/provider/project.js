import dateTime from '~/server/utils/dateTime'
import MemberProxy from '~/server/provider/member'
const Model = require('~/server/models')()

const Message = {
  NoPermission: '无权限操作',
  NotExist: '项目不存在'
}

module.exports = class Project {
  static async save (data) {
    if (!data.id) {
      const project = await Model.Project.create({ ...data, created_at: dateTime() })
      const { id, uid } = project
      await MemberProxy.save({ uid, project_id: id, created_at: dateTime() })
      return project
    } else {
      return Model.Project.update({ ...data, updated_at: dateTime() }, {
        where: { id: data.id }
      })
    }
  }

  static findOne (where) {
    return Model.Project.findOne({
      where
    })
  }

  static findAndCountAll (query) {
    return Model.Project.findAndCountAll(query)
  }

  static async checkById (id, uid, creater) {
    const project = await this.findOne({ id })
    if (project) {
      if (project.uid !== uid) {
        if (creater) return Message.NoPermission
      }
      project.members = await MemberProxy.findUserIdByProjectId(project.id)
      return project
    } else {
      return Message.NotExist
    }
  }

  static destroy (id) {
    return Model.Project.destroy({
      where: {
        id
      }
    })
  }
}
