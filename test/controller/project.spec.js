import Util from '~/test/util'
const app = require('~/server/split')
require('mysql2/node_modules/iconv-lite').encodingExists('foo') // https://github.com/sidorares/node-mysql2/issues/489

describe('/server/controllers/project', () => {
  let request, user

  beforeAll(async () => {
    user = await Util.createUser()
    request = Util.createRequest(app, user.token)
  })

  afterAll(async () => await Util.removeUser(user.id))

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
          swagger_url: 'http://localhost:7400'
        })

      expect(res.body.success).toBe(true)
    })
  })

})

