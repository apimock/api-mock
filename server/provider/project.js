import { genProjectId } from '~/utils/index'
import dateTime from '~/utils/dateTime'
const Model = require('~/server/models')()

export default class Project {
  static save (data) {
    data.sign = genProjectId()
    if (!data.id) {
      return Model.Project.create({...data, created_at: dateTime()})
    } else {
      return Model.Project.update({...data, updated_at: dateTime()}, {
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
