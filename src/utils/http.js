import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import router from '../router/index'
//创建 axios 实例
const axiosInstance = axios.create({
  // timeout: 500,
})
// 添加请求拦截器
axiosInstance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 1. 从pinia里面获取token数据
    const userStore = useUserStore()
    const token = userStore.userInfo.access_token
    // 2. 按照后端的要求拼接token数据
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // console.log(config)
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 1. 从pinia里面获取token数据
    const userStore = useUserStore()
    // 统一错误提示
    ElMessage({
      message: error.response.data.message,
      type: 'error'
    })
    // 401 token 失效处理
    // 清除本地用户数据
    // 跳转到登录页
    if (error.response.status == 401) {
      userStore.clearUserInfo()
      router.push('/login') 
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
