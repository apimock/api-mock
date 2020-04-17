import dateTime from '~/utils/dateTime'
const Model = require('@models')()

export default class Mock {
  static save (data) {
    if (!data.id) {
      return Model.Mock.create({...data, created_at: dateTime()})
    } else {
      return Model.Mock.update({...data, updated_at: dateTime()}, {
        where: { id: data.id }
      })
    }
  }

  static findOne (where) {
    return Model.User.findOne({
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
}
