'use strict'
const DataTypes = require('sequelize')

const _seq = global.__seq
module.exports = function () {
  const Model = {
    User: require('./user')(_seq, DataTypes),
    Project: require('./project')(_seq, DataTypes),
    Mock: require('./mock')(_seq, DataTypes),
    MockRule: require('./mock_rule')(_seq, DataTypes)
  }

  return Model
}
