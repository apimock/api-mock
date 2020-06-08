import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  getById: {
    url: '/api/category/{id}',
    method: 'get'
  },
  list: {
    url: '/api/category',
    method: 'get'
  },
  create: {
    url: '/api/category/create',
    method: 'post'
  },
  update: {
    url: '/api/category/update',
    method: 'post'
  }
})
