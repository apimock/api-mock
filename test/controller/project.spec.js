import Util from '~/test/util'
const app = require('~/server/split')
require('mysql2/node_modules/iconv-lite').encodingExists('foo') // https://github.com/sidorares/node-mysql2/issues/489

describe('/server/controllers/project', () => {
  let request, user

  beforeAll(async () => {
    user = await Util.createUser()
    request = Util.createRequest(app, user.token)
  })

  afterAll(async () => {
    await Util.removeUser(user.id)
  })

  describe('create', () => {
    test('params error',async () => {
      const res = await request('/api/project/create', 'post')
      expect(res.body.message).toBe('params error')
    })

    test('create a project',async () => {
      const res = await request('/api/project/create', 'post')
        .send({
          name: 'demo',
          base_url: '/demo',
          description: 'demo',
          members: [79, 55, 66],
          swagger_url: 'http://localhost:7400'
        })

      expect(res.body.success).toBe(true)
    })

    test('project name already exists',async () => {
      const res = await request('/api/project/create', 'post')
        .send({
          name: 'demo',
          base_url: '/demo1',
          description: 'demo'
        })
      expect(res.body.message).toBe('项目 demo 已存在')
    })

    test('project base_url already exists',async () => {
      const res = await request('/api/project/create', 'post')
        .send({
          name: 'demo2',
          base_url: '/demo',
          description: 'demo'
        })
      expect(res.body.message).toBe('请检查 URL 是否已经存在')
    })
  })

  describe('update', () => {
    test('params error',async () => {
      const res = await request('/api/project/update', 'post')
      expect(res.body.message).toBe('params error')
    })


  })

})

