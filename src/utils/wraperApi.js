import { sub } from '@/utils/sub'
import { axios } from '@/utils/request'

/**
 * 对api进行处理包装
 * @param api
 * @returns {{}}
 */
export default function wraperApi (api) {
  const obj = Object.create(null)
  for (const [name, option] of Object.entries(api)) {
    obj[name] = (parameter, urlObj) => {
      if (urlObj) {
        option.url = sub(option.url, urlObj)
      } else {
        option.url = sub(option.url, parameter)
      }
      if (option.method === 'get') {
        option.params = parameter
      } else {
        option.data = parameter
      }
      if (option.method === 'postQS') {
        return axios.postQS(option)
      } else {
        return axios(option)
      }
    }
  }
  return obj
}
