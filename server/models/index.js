'use strict'
const DataTypes = require('sequelize')

const _seq = global.__seq
module.exports = function () {
  const Model = Object.assign(Object.create(null),{
    User: require('./user')(_seq, DataTypes),
    Project: require('./project')(_seq, DataTypes),
    UserProject: require('./user_project')(_seq, DataTypes),
    Mock: require('./mock')(_seq, DataTypes),
    MockRule: require('./mock_rule')(_seq, DataTypes)
  })

  // CREATE TABLE IF NOT EXISTS
  for (const name in Model) {
    Model[name].sync()
  }

  Model.Project.belongsTo(Model.User,{
    foreignKey: 'uid',
    sourceKey: 'id'
  })

  return Model
}
