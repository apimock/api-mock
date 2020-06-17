import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  list: {
    url: '/api/member',
    method: 'get'
  },
  create: {
    url: '/api/member/create',
    method: 'post'
  },
  update: {
    url: '/api/member/update',
    method: 'post'
  },
  delete: {
    url: '/api/member/delete',
    method: 'post'
  }
})
