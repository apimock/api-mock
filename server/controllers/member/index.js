import { Controller, Route } from '~/server/core/decorator'
import Member from '@server/controllers/Member/Member'

@Controller('/api')
class Api {
  @Route('get', '/member')
  list (ctx) {
    return Member.list(ctx)
  }

  @Route('post', '/member/create')
  create (ctx) {
    return Member.create(ctx)
  }

  @Route('post', '/member/delete')
  delete (ctx) {
    return Member.delete(ctx)
  }
}

export default Api
