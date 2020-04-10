require('@babel/register')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const consola = require('consola')
const { Nuxt } = require('nuxt')
const config = require('../nuxt.config.js')
const routes = require('./routes')
const app = new Koa()
config.dev = app.env !== 'production'
app.use(bodyParser())
routes(app)

function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    // nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
