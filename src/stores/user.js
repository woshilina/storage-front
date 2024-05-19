import { defineStore } from 'pinia'
import http from '@/utils/http.js'
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
        userInfo.value = res.data
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        router.push('/user')
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
