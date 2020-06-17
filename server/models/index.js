'use strict'
const DataTypes = require('sequelize')

const _seq = global.__seq
module.exports = function () {
  const Model = Object.assign(Object.create(null), {
    User: require('./user')(_seq, DataTypes),
    Project: require('./project')(_seq, DataTypes),
    Category: require('./category')(_seq, DataTypes),
    Member: require('./member')(_seq, DataTypes),
    Mock: require('./mock')(_seq, DataTypes),
    Expect: require('./expect')(_seq, DataTypes)
  })

  // CREATE TABLE IF NOT EXISTS
  for (const name in Model) {
    Model[name].sync()
  }

  Model.Project.belongsTo(Model.User, {
    foreignKey: 'uid',
    sourceKey: 'id'
  })

  Model.Member.belongsTo(Model.User, {
    foreignKey: 'uid',
    sourceKey: 'id'
  })

  Model.Mock.belongsTo(Model.User, {
    foreignKey: 'uid',
    sourceKey: 'id'
  })

  Model.Category.hasMany(Model.Mock, {
    foreignKey: 'category_id',
    sourceKey: 'id',
    as: 'children'
  })

  Model.Expect.belongsTo(Model.User, {
    foreignKey: 'uid',
    sourceKey: 'id'
  })

  return Model
}
