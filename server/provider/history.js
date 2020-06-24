import dateTime from '@server/utils/dateTime'

const Model = require('~/server/models')()

module.exports = class History {
  static save (data) {
    if (!data.id) {
      return Model.History.create({ ...data, created_at: dateTime() })
    } else {
      return Model.History.update({ ...data, updated_at: dateTime() }, {
        where: { id: data.id }
      })
    }
  }

  static findOne (where) {
    return Model.History.findOne({
      where
    })
  }

  static findAll (where) {
    return Model.History.findAll({
      where
    })
  }

  static findAndCountAll (query) {
    return Model.History.findAndCountAll(query)
  }

  static destroy (where) {
    return Model.History.destroy({
      where
    })
  }
}
