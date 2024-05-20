import { defineStore } from 'pinia'
import http from '@/utils/http.js'
import { ref } from 'vue'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menus = ref([])
    const setMenus = async () => {
      await http.get('/api/v1/permissions?type=0,1').then((res) => {
        menus.value = res.data
      })
    }
    return { menus, setMenus }
  },
  {
    persist: true
  }
)

// 所有权限
export const usePermissionStore = defineStore(
  'permissions',
  () => {
    const permissions = ref([])
    const setPermissions = async () => {
      await http.get('/api/v1/permissions').then((res) => {
        permissions.value = res.data
      })
    }
    return { permissions, setPermissions }
  },
  {
    persist: true
  }
)