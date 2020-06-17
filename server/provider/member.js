import dateTime from '~/server/utils/dateTime'
const Model = require('~/server/models')()

module.exports = class Member {
  static save (data) {
    return Model.Member.create({ ...data, created_at: dateTime() })
  }

  static bulkCreate (data) {
    return Model.Member.bulkCreate(data)
  }

  static findProjectIdByUserId (uid) {
    const res = Model.Member.findAll({
      attributes: ['project_id'],
      where: {
        uid
      }
    })
    return res.map((item) => item.project_id)
  }

  static findUserIdByProjectId (projectId) {
    const res = Model.Member.findAll({
      attributes: ['uid'],
      where: {
        project_id: projectId
      }
    })
    return res.map((item) => item.uid)
  }

  static findAll (query) {
    return Model.Member.findAll(query)
  }

  static destroy (where) {
    return Model.Member.destroy({
      where
    })
  }
}
