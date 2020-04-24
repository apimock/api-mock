import { genProjectId } from '~/utils/index'
import dateTime from '~/utils/dateTime'
import ProjectUserProxy from '~/server/provider/userProject'
const Model = require('~/server/models')()

const Message = {
  NoPermission: '无权限操作',
  NotExist: '项目不存在'
}

module.exports = class Project {
  static async save (data) {
    const members = data.members
    delete data.members
    if (!data.id) {
      data.sign = genProjectId()
      const project = await Model.Project.create({...data, created_at: dateTime()})
      const { id, uid } = project
      const userProjectAll = members.concat(uid).map(uid => ({ uid, project_id:id , created_at: dateTime()}))
      await ProjectUserProxy.bulkCreate(userProjectAll)
      return project
    } else {
      return Model.Project.update({...data, updated_at: dateTime()}, {
        where: { id: data.id }
      })
    }
  }

  static findOne (where) {
    return Model.Project.findOne({
      where
    })
  }

  static findAll(query) {
    return  Model.Project.findAll(query)
  }

  static async checkById (id, uid, creater) {
    const project = await this.findOne({ id })
    if (project) {
      if (project.uid !== uid) {
        if (creater) return Message.NoPermission
      }
      project.members = await ProjectUserProxy.findUserIdByProjectId(project.id)
      return project
    } else {
      return Message.NotExist
    }
  }

  static delete (id) {
    // return Model.User.destroy({
    //   where: {
    //     id
    //   }
    // })
    return this.save({id, status: 0})
  }
}
