import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  list: {
    url: '/api/mock',
    method: 'get'
  },
  create: {
    url: '/api/mock/create',
    method: 'post'
  },
  update: {
    url: '/api/mock/update',
    method: 'post'
  }
})
