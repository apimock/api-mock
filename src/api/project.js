import wraperApi from '@/utils/wraperApi'
export default wraperApi({
  list: {
    url: '/api/project',
    method: 'get'
  }
})
