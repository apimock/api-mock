import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  list: {
    url: '/api/history',
    method: 'get'
  }
})
