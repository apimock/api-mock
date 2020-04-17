import Project from './project'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/project', { auth: false })
  create(ctx) {
    return Project.create(ctx)
  }
}

export default Api
