import { ref, toValue, onMounted } from 'vue'
import http from '@/utils/http.js'
import { ElMessageBox, ElMessage } from 'element-plus'

export function useSuperTable(getTableDataUrl, filterParams, deleteDataUrl) {
  const tableData = ref([])
  const page = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50]
  })
  const loading = ref(false)
  const onQueryTableData = () => {
    loading.value = true
    const params = { currentPage: page.value.currentPage, pageSize: page.value.pageSize, ...toValue(filterParams) }
    http
      .get(getTableDataUrl, { params })
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

  //  批量删除功能
  const deleteIds = ref([])
  const onHandleMultiDel = () => {
    ElMessageBox.confirm('确定删除所选数据吗?')
      .then(() => {
        http.delete(deleteDataUrl, { data: { ids: deleteIds.value } }).then(() => {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          onQueryTableData()
        })
      })
      .catch(() => {})
  }
  //  点击行删除
  const rowDel = (index, row) => {
    ElMessageBox.confirm('确定删除此行数据吗?')
      .then(() => {
        http.delete(deleteDataUrl, { data: { ids: [row.id] } }).then(() => {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          onQueryTableData()
        })
      })
      .catch(() => {})
  }
  return { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel }
}
