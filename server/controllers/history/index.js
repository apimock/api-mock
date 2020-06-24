import History from './history'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/history')
  list (ctx) {
    return History.list(ctx)
  }
}

export default Api
