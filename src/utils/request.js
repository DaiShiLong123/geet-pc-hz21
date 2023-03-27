import axios from 'axios'
import { hasToken, getToken } from 'utils/storage'
import history from 'utils/history'
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
    //   在发送请求之前做些什么
    if (hasToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },

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
    // 对于token过期进行统一的处理
    if (error.request.status === 401) {
      //代表token过期了
      //1.删除token
      //2.给提示消息
      //3.跳转到登录
      //难点：在非组件中，我们是无法使用Redirect 也无法访问到history对象
      history.push('/login')
    }
    return Promise.reject(error)
  }
)
// 导出
export default instance
