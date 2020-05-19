// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { VueAxios } from './vueAxios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      console.error({
        message: '登录失效',
        description: data.message
      })
    }
  }
  return Promise.reject(error)
}

service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}` // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  return response
}, err)

service.postQS = (option) => {
  const headers = Object.assign(Object.create(null), option.headers, {
    'content-type': 'application/x-www-form-urlencoded'
  })
  const config = Object.assign(Object.create(null), option, {
    headers,
    data: qs.stringify(option.data),
    method: 'post'
  })
  return service(config)
}

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
