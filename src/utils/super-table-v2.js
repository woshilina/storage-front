import { ref, onMounted, reactive, toValue, watchEffect, computed } from 'vue'
import http from '@/utils/request.js'

export function useSuperTable(url, filterParams) {
  const data = ref([])
  const page = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const loading = ref(false)
  const onLoad = () => {
    loading.value = true
    console.log(filterParams.value)
    const params = { currentPage: page.value.currentPage, pageSize: page.value.pageSize, ...toValue(filterParams) }
    http
      .get(url, { params })
      .then((res) => {
        data.value = res.data.data
        page.value.total = res.data.total
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    onLoad()
  })
  const handleFilter = () => {
    page.value.currentPage = 1
    onLoad()
  }
  const handleSizeChange = (val) => {
    page.value.pageSize = val
    onLoad()
  }
  const handleCurrentChange = (val) => {
    page.value.currentPage = val
    onLoad()
  }
  return { data, page, loading, onLoad, handleFilter, handleSizeChange, handleCurrentChange }
}
