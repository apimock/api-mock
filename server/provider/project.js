import { genProjectId } from '~/utils/index'
import dateTime from '~/utils/dateTime'
const Model = require('~/server/models')()

const Message = {
  NoPermission: '无权限操作',
  NotExist: '项目不存在'
}

module.exports = class Project {
  static async save (data) {
    data.sign = genProjectId()
    if (!data.id) {
      const project = await Model.Project.create({...data, created_at: dateTime()})
      const { id, uid } = project
      let members = project.members
      members = members ? members.split(',') : []
      const userProjectAll = members.concat(uid).map(uid => ({ uid, project_id:id , created_at: dateTime()}))
      await Model.UserProject.bulkCreate(userProjectAll)
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
    const projects = Model.Project.findAll(query)
    return projects
  }

  static async checkById (id, uid, creater) {
    const project = await this.findOne({ id })
    if (project) {
      if (project.uid !== uid) {
        if (creater) return Message.NoPermission
      }
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
