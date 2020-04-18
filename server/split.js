require('@babel/register')
const moduleAlias = require('module-alias')
const Koa = require('koa')
const koaBody = require('koa-body')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const validate = require('koa-validate')
const config = require('../nuxt.config.js')
const middleware = require('./middleware')
const app = new Koa()
config.dev = app.env !== 'production'
moduleAlias.addAliases(require('../alias').resolve.alias)
require('./core/dbConnect')()
validate(app)
app.use(middleware.util)
app.use(koaBody({ multipart: true }))

const routes = require('./routes')
routes(app)

function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // await nuxt.ready()
  // // Build in development
  // if (config.dev) {
  //   const builder = new Builder(nuxt)
  //   await builder.build()
  // }

  // await nuxt.ready()
  // Build in development
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    // nuxt.render(ctx.req, ctx.res)
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, (promise) => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

if (!module.parent) {
  start()
} else{
  module.exports = app.listen()
}
