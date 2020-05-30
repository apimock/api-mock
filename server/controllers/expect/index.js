import Expect from './Expect'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/Expect')
  list (ctx) {
    return Expect.list(ctx)
  }

  @Route('post', '/Expect/create')
  create (ctx) {
    return Expect.create(ctx)
  }

  @Route('post', '/Expect/update')
  update (ctx) {
    return Expect.update(ctx)
  }
}

export default Api
