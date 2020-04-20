import dateTime from '~/utils/dateTime'
const Model = require('~/server/models')()

module.exports = class Project {
  static save (data) {
    return Model.UserProject.create({...data, created_at: dateTime()})
  }

  static findOne (where) {
    return Model.UserProject.findOne({
      where
    })
  }

  static delete (id) {
    // return Model.User.destroy({
    //   where: {
    //     id
    //   }
    // })
    return this.save({id, status: 0})
  }

  static remove (id) {
    return Model.UserProject.destroy({
      where: {
        id
      }
    })
  }
}
