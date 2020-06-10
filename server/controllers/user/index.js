import User from './user'
import { Controller, Route } from '~/server/core/decorator'

@Controller('/api')
class Api {
  @Route('get', '/userInfo')
  userInfo (ctx) {
    return User.userInfo(ctx)
  }

  @Route('post', '/register', { auth: false })
  register (ctx) {
    return User.register(ctx)
  }

  @Route('post', '/login', { auth: false })
  login (ctx) {
    return User.login(ctx)
  }

  @Route('post', '/star')
  star (ctx) {
    return User.star(ctx)
  }
}

export default Api
