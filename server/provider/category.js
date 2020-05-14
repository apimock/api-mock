import dateTime from '@server/utils/dateTime'

const Model = require('~/server/models')()

module.exports = class Category {
  static save (data) {
    if (!data.id) {
      return Model.Category.create({ ...data, created_at: dateTime() })
    } else {
      return Model.Category.update({ ...data, updated_at: dateTime() }, {
        where: { id: data.id }
      })
    }
  }

  static findAll (query) {
    return Model.Category.findAll(query)
  }
}
