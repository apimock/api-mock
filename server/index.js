require('@babel/register')
const moduleAlias = require('module-alias')
moduleAlias.addAliases(require('../alias').resolve.alias)
const Koa = require('koa')
const koaBody = require('koa-body')
const consola = require('consola')
const validate = require('koa-validate')
const config = require('config')
const middleware = require('./middleware')
const app = new Koa()
config.dev = app.env !== 'production'
require('./core/dbConnect')()
validate(app)
app.use(middleware.util)
app.use(koaBody({ multipart: true }))

const routes = require('./routes')
routes(app)

function start () {
  const port = config.get('port')
  const host = config.get('host')

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

if (!module.parent) {
  start()
} else {
  module.exports = app.listen()
}
