import dateTime from '~/utils/dateTime'
const Model = require('@models')()
const User = {
  save: (data) => {
    if (!data.id) {
      return Model.User.create({...data, created_at: dateTime()})
    } else {
      return Model.User.update({...data, updated_at: dateTime()}, {
        where: { id: data.id }
      })
    }
  }
}

export default User
