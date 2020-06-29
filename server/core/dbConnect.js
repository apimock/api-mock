const { Sequelize } = require('sequelize')
const config = require('config')
const __seq = Symbol.for('__seq')

module.exports = function dbConnect () {
  if (!config.has('mysql')) {
    return Promise.reject(new Error('dbConnect: config.mysql is required'))
  }
  const mysql = config.get('mysql')
  const seq = new Sequelize(
    mysql.database,
    mysql.user,
    mysql.password,
    mysql.option
  )
  seq
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.')
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
  global[__seq] = seq
}
