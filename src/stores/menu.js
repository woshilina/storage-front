import { defineStore } from 'pinia'
import http from '@/utils/http.js'
import { ref } from 'vue'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menus = ref([])
    const setMenus = async () => {
      await http.get('/api/v1/menus?type=0,1').then((res) => {
        menus.value = res.data
      })
    }
    return { menus, setMenus }
  },
  {
    persist: true
  }
)
