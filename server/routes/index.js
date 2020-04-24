import fs from 'fs'
import path from 'path'
import consola from 'consola'
import Router from 'koa-router'
import MockApi from '~/server/controllers/mock/mockApi'
const restc = require('restc').koa2()
const middleware = require('../middleware')

function initMockRouter (app) {
  const mockRouter = new Router({prefix: '/mock'})
  mockRouter.all('*', middleware.mockFilter, restc, MockApi.getApi)
  app.use(mockRouter.routes()).use(mockRouter.allowedMethods())
}

module.exports = function(app) {
  initMockRouter(app)

  fs.readdirSync(path.join(__dirname, '../controllers')).filter(file => {
    return (file.indexOf('.') !== 0)
  }).forEach((file) => {
    consola.ready({
      message: `Init controller: ${file}`
    })
    try {
      const res = require(`~/server/controllers/${file}`)
      app.use(res.default.routes()).use(res.default.allowedMethods())
    } catch (e) {
      console.error(e)
    }
  })
}
