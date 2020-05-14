import wraperApi from '@/utils/wraperApi'
export default wraperApi({
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
