import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  login: {
    url: '/api/login',
    method: 'post'
  },
  getInfo: {
    url: '/api/v2/admin/user-info',
    method: 'get'
  },
  logout: {
    url: '/api/v2/admin/logout',
    method: 'post'
  }
})
