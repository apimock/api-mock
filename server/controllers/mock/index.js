import Mock from './mock'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/mock')
  list (ctx) {
    return Mock.list(ctx)
  }

  @Route('get', '/mock/detail')
  detail (ctx) {
    return Mock.detail(ctx)
  }

  @Route('post', '/mock/create')
  create (ctx) {
    return Mock.create(ctx)
  }

  @Route('post', '/mock/update')
  update (ctx) {
    return Mock.update(ctx)
  }

  @Route('post', '/mock/delete')
  delete (ctx) {
    return Mock.delete(ctx)
  }
}

export default Api
