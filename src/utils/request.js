import axios from 'axios'
// 创建axios实例
const instance = axios.create({
  // 基础路径
  baseURL: 'http://geek.itheima.net/v1_0/',
  // 超时时间
  timeout: 5000,
})

// 配置拦截器
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    return config
  },
  //   在发送请求之前做些什么
  function (error) {
    //   对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  //   在发送请求之前做些什么
  function (error) {
    //   对请求错误做些什么
    return Promise.reject(error)
  }
)
// 导出
export default instance
