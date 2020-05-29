import Project from './project'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/project')
  list (ctx) {
    return Project.list(ctx)
  }

  @Route('get', '/project/:id')
  getById (ctx) {
    return Project.getById(ctx)
  }

  @Route('post', '/project/create')
  create (ctx) {
    return Project.create(ctx)
  }

  @Route('post', '/project/update')
  update (ctx) {
    return Project.update(ctx)
  }
}

export default Api
