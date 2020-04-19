import Util from '~/test/util'
const app = require('~/server/split')
const {username, password} = Util.getUser()

describe('/server/controllers/user', () => {
  let request, user

  beforeAll(async () => {
    user = await Util.createUser()
    request = Util.createRequest(app, user.token)
  })

  afterAll(async () => await Util.removeUser(user.id))

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
        .send({ username, password })

      expect(res.body.data.username).toBe(username)
    })

    test('user does not exist', async () => {
      const res = await request('/api/login', 'post')
        .send({ username: 'te2st', password: '123456' })

      expect(res.body.message).toBe('用户不存在')
    })

    test('username or password error', async () => {
      const res = await request('/api/login', 'post')
        .send({ username, password: '1234567' })

      expect(res.body.message).toBe('用户名或密码错误')
    })
  })
})

