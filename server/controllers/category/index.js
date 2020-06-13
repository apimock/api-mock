import Category from './category'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/category')
  list (ctx) {
    return Category.list(ctx)
  }

  @Route('get', '/category/:id')
  getById (ctx) {
    return Category.getById(ctx)
  }

  @Route('post', '/category/create')
  create (ctx) {
    return Category.create(ctx)
  }

  @Route('post', '/category/update')
  update (ctx) {
    return Category.update(ctx)
  }

  @Route('post', '/category/delete')
  delete (ctx) {
    return Category.delete(ctx)
  }
}

export default Api
