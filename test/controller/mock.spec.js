import Util from '~/test/util'
const app = require('~/server/split')
require('mysql2/node_modules/iconv-lite').encodingExists('foo') // https://github.com/sidorares/node-mysql2/issues/489

describe('/server/controllers/mock', () => {
  let request, user, project

  beforeAll(async () => {
    user = await Util.createUser()
    request = Util.createRequest(app, user.token)
    project = await request('/api/project').then(res => res.body.data[0])
    // console.info(project)
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
        url: '/aa/%E6%88%91%E6%98%AF%E4%B8%AD%E5%9B%BD%E4%BA%BA/cc',
        method: 'post',
        body: '{code: 1}',
        description: 'mock test'
      })
      expect(res.body.success).toBe(true)
    })

    test('no permission', async () => {
      const res = await request('/api/mock/create', 'post', 'abcd')
        .send({
          project_id: project.id,
          url: '/aa/bb/cc',
          method: 'delete',
          body: '{}',
          description: 'mock'
        })

      expect(res.body.message).toBe('无权限操作')
    })

    test('mock is already exists', async () => {
      const res = await request('/api/mock/create', 'post')
        .send({
          project_id: project.id,
          url: '/aa/%E6%88%91%E6%98%AF%E4%B8%AD%E5%9B%BD%E4%BA%BA/cc',
          method: 'post',
          body: '{}',
          description: 'mock'
        })

      expect(res.body.message).toBe('请检查接口是否已经存在')
    })
  })

  describe('update', () => {
    test('params error',async () => {
      const res = await request('/api/mock/update', 'post')
      expect(res.body.message).toBe('params error')
    })

    test('api mock does not exist', async () => {
      const res = await request('/api/mock/update', 'post')
        .send({
          id: '111111111111111111111111',
          url: '/demo',
          body: '{}',
          method: 'get',
          description: 'demo'
        })

      expect(res.body.message).toBe('接口不存在')
    })

    test('update mock', async () => {
      let res = await request('/api/mock').query({ project_sign: project.sign })
      res = await request('/api/mock/update', 'post')
        .send({
          id: res.body.data[0].id,
          url: '/update/mock',
          body: '{update: 1}',
          method: 'post',
          description: 'mock update'
        })

      expect(res.body.success).toBe(true)
    })


  })

})
