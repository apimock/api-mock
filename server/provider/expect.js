import dateTime from '@server/utils/dateTime'

const Model = require('~/server/models')()

module.exports = class Expect {
  static save (data) {
    if (!data.id) {
      return Model.Expect.create({ ...data, created_at: dateTime() })
    } else {
      return Model.Expect.update({ ...data, updated_at: dateTime() }, {
        where: { id: data.id }
      })
    }
  }

  static findAndCountAll (query) {
    return Model.Expect.findAndCountAll(query)
  }
}
