import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  list: {
    url: '/api/expect',
    method: 'get'
  },
  create: {
    url: '/api/expect/create',
    method: 'post'
  },
  update: {
    url: '/api/expect/update',
    method: 'post'
  },
  delete: {
    url: '/api/expect/delete',
    method: 'post'
  }
})
