import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  getById: {
    url: '/api/project/{id}',
    method: 'get'
  },
  list: {
    url: '/api/project',
    method: 'get'
  },
  create: {
    url: '/api/project/create',
    method: 'post'
  },
  update: {
    url: '/api/project/update',
    method: 'post'
  }
})
