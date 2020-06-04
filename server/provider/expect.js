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

  static findOne (where) {
    return Model.Expect.findOne({
      where
    })
  }

  static findAll (where) {
    return Model.Expect.findAll({
      where
    })
  }

  static findAndCountAll (query) {
    return Model.Expect.findAndCountAll(query)
  }

  static count (where) {
    return Model.Expect.count({
      where
    })
  }

  static remove (where) {
    return Model.Expect.destroy({
      where
    })
  }
}
