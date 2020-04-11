import { Controller, Route } from '@core/decorator'

@Controller('/api')
class Test {
  @Route('get', '/login', { auth: false })
  login(ctx) {
    ctx.body = 'hello world'
  }
}

export default Test
