import Mock from './mock'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/mock')
  list(ctx) {
    return Mock.list(ctx)
  }

  @Route('post', '/mock/create')
  create(ctx) {
    return Mock.create(ctx)
  }

  @Route('post', '/mock/update')
  update(ctx) {
    return Mock.update(ctx)
  }
}

export default Api
