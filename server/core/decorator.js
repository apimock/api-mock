import Router from 'koa-router'
// import { validate } from './validate'

const validate = () => {
  return {
    code: true
  }
}

export const Controller = (baseUrl = '/api') => {
  const router = new Router()
  if (baseUrl) {
    router.prefix(baseUrl)
  }
  return (target) => {
    const property = Object.getOwnPropertyDescriptors(target.prototype)
    for (const i in property) {
      i !== 'constructor' && property[i].value(router)
    }
    return router
  }
}

export const Route = (method, url, opt) => {
  return (target, name, descriptor) => {
    const fn = descriptor.value
    descriptor.value = (router) => {
      router[method](url, async (ctx, next) => {
        // 登录和权限校验
        const { code, msg } = await validate(
          ctx,
          Object.assign({ auth: true, permission: null }, opt)
        )
        if (code) {
          await fn(ctx, next)
        } else {
          ctx.body = ctx.util.refail(msg)
        }
      })
    }
  }
}
