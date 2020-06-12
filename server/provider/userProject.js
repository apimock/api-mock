import dateTime from '~/server/utils/dateTime'
const Model = require('~/server/models')()

module.exports = class Project {
  static save (data) {
    return Model.UserProject.create({ ...data, created_at: dateTime() })
  }

  static bulkCreate (data) {
    return Model.UserProject.bulkCreate(data)
  }

  static findProjectIdByUserId (uid) {
    const res = Model.UserProject.findAll({
      attributes: ['project_id'],
      where: {
        uid
      }
    })
    return res.map((item) => item.project_id)
  }

  static findUserIdByProjectId (projectId) {
    const res = Model.UserProject.findAll({
      attributes: ['uid'],
      where: {
        project_id: projectId
      }
    })
    return res.map((item) => item.uid)
  }

  static destroy (where) {
    return Model.UserProject.destroy({
      where
    })
  }
}
