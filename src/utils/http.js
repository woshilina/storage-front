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
    // 1. 从localStorage里面获取token数据
    const token = localStorage.getItem('access_token')
    // 2. 按照后端的要求拼接token数据
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 是否还需要刷新token的标识
let refreshing = false
// 存储未完成的请求
const task = []
// 刷新token
async function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token')
  const res = await axiosInstance.get(`/api/v1/auth/refreshtoken?refreshToken=${refresh_token}`)
  localStorage.setItem('access_token', res.data.access_token)
  localStorage.setItem('refresh_token', res.data.refresh_token)
  return res
}

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    refreshing = false
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response
  },
  async function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。

    const { data, config } = error.response
    // refresh_token验证失败时 清除用户信息 跳转到登录页
    // 此判断要在 if(refreshing)之前  因为 refreshtoken 时 refreshing 为 true，会进入判断语句 return promise 不会向下进行
    if (config.url.includes('/api/v1/auth/refreshtoken')) {
      window.localStorage.removeItem('access_token')
      window.localStorage.removeItem('refresh_token')
      const userStore = useUserStore()
      userStore.clearUserInfo()
      router.push('/login')
    }
    // 如果正在刷新token，则将失败的请求挂起,
    // 存入task中等待刷新token完成在全部执行出来
    if (refreshing) {
      console.log(refreshing)
      return new Promise((resolve) => {
        task.push({
          config,
          resolve
        })
      })
    }

    // 如果是登录过期并且请求的地址不是 /api/v1/auth/refreshtoken，就调用refreshToken
    if (error.response.status == 401 && !config.url.includes('/api/v1/auth/refreshtoken')) {
      // 此时需要刷新了
      refreshing = true
      await refreshToken()
      refreshing = false
      task.forEach(({ config, resolve }) => {
        resolve(axiosInstance(config))
      })
      return axiosInstance(config)
    }
    // 统一错误提示
    ElMessage({
      message: error.response.data.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default axiosInstance
