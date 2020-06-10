import dateTime from '~/server/utils/dateTime'
const Model = require('~/server/models')()

module.exports = class User {
  static save (data) {
    if (!data.id) {
      return Model.User.create({ ...data, created_at: dateTime() })
    } else {
      return Model.User.update({ ...data, updated_at: dateTime() }, {
        where: { id: data.id }
      })
    }
  }

  static findOne (where, attributes = { exclude: ['password', 'stars'] }) {
    return Model.User.findOne({
      where,
      attributes
    })
  }

  static findByUserName (username) {
    return Model.User.findOne({
      where: {
        username
      }
    })
  }

  static delete (id) {
    return this.save({ id, status: 0 })
  }

  static remove (id) {
    return Model.User.destroy({
      where: {
        id
      }
    })
  }
}
