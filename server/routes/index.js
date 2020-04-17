import fs from 'fs'
import path from 'path'
import consola from 'consola'
// import { axios } from '@utils/request'

module.exports = function(app) {
  // // 注入axios
  // app.use(async (ctx, next) => {
  //   // 访问接口时执行
  //   // axios(ctx)
  //   await next()
  // })
  fs.readdirSync(path.join(__dirname, '../controllers')).forEach((o) => {
    consola.ready({
      message: `Init controller: ${o}`
    })
    const res = require(`~/server/controllers/${o}`)
    app.use(res.default.routes()).use(res.default.allowedMethods())
  })
}
