import dateTime from '~/server/utils/dateTime'
const Model = require('~/server/models')()
const Op = require('sequelize').Op

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

  static findOne (where, attributes = { exclude: ['password', 'star_mock', 'star_project'] }) {
    return Model.User.findOne({
      where,
      attributes
    })
  }

  static findByUserName (username, email) {
    return Model.User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    })
  }

  static async getStars (uid, field) {
    const user = await this.findOne({ id: uid }, [field])
    const stars = user[field]
    let res = []
    if (stars) {
      try {
        res = JSON.parse(stars)
      } catch (e) {
      }
    }
    return res
  }

  static delete (id) {
    return this.save({ id, status: 0 })
  }

  static destroy (id) {
    return Model.User.destroy({
      where: {
        id
      }
    })
  }
}
