import Util from '~/test/util'
const app = require('~/server/split')
require('mysql2/node_modules/iconv-lite').encodingExists('foo') // https://github.com/sidorares/node-mysql2/issues/489

describe('/server/controllers/mock', () => {
  let request, user, project

  beforeAll(async () => {
    user = await Util.createUser()
    request = Util.createRequest(app, user.token)
    project = await request('/api/project').then(res => res.body.data[0])
    console.info(project)
  })

  afterAll(async () => {
    // await Util.removeUser(user.id)
  })

  describe('create', () => {
    test('params error',async () => {
      const res = await request('/api/mock/create', 'post')
      expect(res.body.message).toBe('params error')
    })

    test('create a mock',async () => {
      const res = await request('/api/mock/create', 'post').send({
        project_id: project.id,
        url: '/mock',
        method: 'get',
        rule: '{code: 1}',
        description: 'mock test'
      })
      expect(res.body.success).toBe(true)
    })
  })

})
