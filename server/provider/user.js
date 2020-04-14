const Model = require('@models')()

const User = {
  createOne: (data) => {
    return Model.User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
      role: data.role,
      status: data.status
    })
  }
}

export default User
