import dateTime from '~/server/utils/dateTime'
import ProjectProxy from '~/server/provider/project'
const Model = require('~/server/models')()
const Message = {
  NoPermission: '无权限操作',
  NotExist: '接口不存在'
}

module.exports = class Mock {
  static save (data) {
    if (!data.id) {
      return Model.Mock.create({ ...data, created_at: dateTime() })
    } else {
      return Model.Mock.update({ ...data, updated_at: dateTime() }, {
        where: { id: data.id }
      })
    }
  }

  static findAndCountAll (query) {
    return Model.Mock.findAndCountAll(query)
  }

  static findOne (where) {
    return Model.Mock.findOne({
      where
    })
  }

  static async checkById (id, uid, creater) {
    const mock = await this.findOne({ id })
    if (mock) {
      if (mock.uid !== uid) {
        if (creater) return Message.NoPermission
      }
      const checkProjet = await ProjectProxy.checkById(mock.project_id)
      if (typeof checkProjet === 'string') return checkProjet
      return mock
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
    return this.save({ id, status: 0 })
  }
}
