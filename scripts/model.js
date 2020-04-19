const cp = require('child_process')
const consola = require('consola')
const mysql = require('config').mysql

const bash = `./node_modules/@tkay/sequelize-auto/bin/sequelize-auto -h ${mysql.option.host} -d ${mysql.database} -u ${mysql.user} -x ${mysql.password} -o "./server/models"`
const runModel = cp.exec(bash)
consola.info({
  message: `${bash}`
})
runModel.stdout.on('data', data => {
  consola.info({
    message: `${data}`
  })
})
runModel.stderr.on('data', data => {
  consola.error({
    message: `${data}`
  })
})
runModel.on('close', code => {
  if (code === 0) {
    consola.ready({
      message: `models initialize completed...`
    })
  }
})
