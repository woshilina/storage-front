import { defineStore } from 'pinia'
import http from '@/utils/http.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

import { ref } from 'vue'
export const useUserStore = defineStore(
  'user',
  () => {
    const router = useRouter()
    const userInfo = ref({
      user: {},
      permissions: []
    })
    const setUserInfo = async (loginData) => {
      await http.post('/api/v1/auth/login', loginData).then((res) => {
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        userInfo.value.user = res.data.user
        userInfo.value.permissions = res.data.permissions
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        router.push('/')
      })
    }
    const getUserPermissions = () => {
      return userInfo.value.permissions
    }
    // 退出时清除用户信息
    const clearUserInfo = () => {
      userInfo.value = {}
    }

    return { userInfo, setUserInfo, getUserPermissions, clearUserInfo }
  },
  {
    persist: true
  }
)
