import Util from '~/test/util'
const app = require('~/server/split')

describe('/server/controllers/user', () => {
  let request, user

  beforeAll(async () => {
    user = await Util.login('test25', '123456')
    request = Util.createRequest(app, user.token)
  })

  describe('register', () => {
    test('params error', async () => {
      const res = await request('/api/register', 'post')
      expect(res.body.message).toBe('params error')
    })
  })

  describe('login', () => {
    test('params error', async () => {
      const res = await request('/api/login', 'post')

      expect(res.body.message).toBe('params error')
    })

    test('login success', async () => {
      const res = await request('/api/login', 'post')
        .send({ username: 'test25', password: '123456' })

      expect(res.body.data.username).toBe('test25')
    })

    test('user does not exist', async () => {
      const res = await request('/api/login', 'post')
        .send({ username: 'te2st', password: '123456' })

      expect(res.body.message).toBe('用户不存在')
    })

    test('username or password error', async () => {
      const res = await request('/api/login', 'post')
        .send({ username: 'test255', password: '1234567' })

      expect(res.body.message).toBe('用户名或密码错误')
    })
  })
})

