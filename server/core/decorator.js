import Router from 'koa-router'
import { validate } from './validate'

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

export const Route = (method, url, option) => {
  return (target, name, descriptor) => {
    const fn = descriptor.value
    descriptor.value = (router) => {
      router[method](url, async (ctx, next) => {
        // 登录和权限校验
        const { code, message } = validate(
          ctx,
          Object.assign({ auth: true, permission: null }, option)
        )
        if (code === 1) {
          await fn(ctx, next)
        } else {
          ctx.body = ctx.util.refail(message)
        }
      })
    }
  }
}
