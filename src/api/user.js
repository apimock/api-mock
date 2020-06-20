import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  login: {
    url: '/api/login',
    method: 'post'
  },
  register: {
    url: '/api/register',
    method: 'post'
  },
  getInfo: {
    url: '/api/userInfo',
    method: 'get'
  },
  update: {
    url: '/api/user/update',
    method: 'post'
  },
  star: {
    url: '/api/user/star',
    method: 'post'
  }
})
