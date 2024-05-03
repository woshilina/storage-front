import { ref, onMounted, toValue } from 'vue'
import http from '@/utils/http.js'

export function useSuperTable(url, filterParams) {
  const tableData = ref([])
  const page = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
  })

  const loading = ref(false)
  const onQueryTableData = () => {
    loading.value = true
    const params = { currentPage: page.value.currentPage, pageSize: page.value.pageSize, ...toValue(filterParams) }
    http
      .get(url, { params })
      .then((res) => {
        tableData.value = res.data.data
        page.value.total = res.data.total
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false
      })
  }

  onMounted(() => {
    onQueryTableData()
  })
  const onHandleFilter = () => {
    page.value.currentPage = 1
    onQueryTableData()
  }
  const onSizeChange = (val) => {
    page.value.pageSize = val
    onQueryTableData()
  }
  const onCurrentChange = (val) => {
    page.value.currentPage = val
    onQueryTableData()
  }
  return { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange }
}
