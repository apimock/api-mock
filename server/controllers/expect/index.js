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
    return Expect.createOrUpdate(ctx)
  }

  @Route('post', '/Expect/update')
  update (ctx) {
    return Expect.createOrUpdate(ctx, true)
  }

  @Route('post', '/Expect/delete')
  delete (ctx) {
    return Expect.delete(ctx)
  }
}

export default Api
