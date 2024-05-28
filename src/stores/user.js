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
      access_token: '',
      user: {},
      permissions: []
      // menuTree: [],
      // routes: []
    })
    const setUserInfo = async (loginData) => {
      await http.post('/api/v1/auth/login', loginData).then((res) => {
        userInfo.value.access_token = res.data.access_token
        userInfo.value.user = res.data.user
        userInfo.value.permissions = res.data.permissions
        // userInfo.value.menuTree = res.data.menuTree
        // userInfo.value.routes = res.data.routes
        ElMessage({
          message: '登录成功',
          type: 'success'
        })
        router.push('/user')
      })
    }
    const getUserPermissions = () => {
      return userInfo.value.permissions
    }
    // const getUserMenuTree = () => {
    //   return userInfo.value.menuTree
    // }
    // const getUserRoutes = () => {
    //   return userInfo.value.routes
    // }
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
