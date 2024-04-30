import { defineStore } from 'pinia'
import http from '@/utils/request.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    const router = useRouter()
    const userInfo = ref({})
    const setUserInfo = async (loginData) => {
      await http.post('/api/v1/auth/login', loginData).then((res) => {
        console.log(res)
        if (res.status == '200') {
          userInfo.value = res.data
          console.log(userInfo.value)
          ElMessage({
            message: '登录成功',
            type: 'success'
          })
          router.push('/v2')
        } else {
          ElMessage({
            message: res.data.message,
            type: 'error'
          })
        }
      })
    }
    // 退出时清除用户信息
    const clearUserInfo = () => {
      userInfo.value = {}
    }

    return { userInfo, setUserInfo, clearUserInfo }
  },
  {
    persist: true
  }
)
