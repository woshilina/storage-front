import { ref, isRef, toValue, onMounted, computed } from 'vue'
import http from '@/utils/http.js'
import { TableV2SortOrder } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
export function useSuperTable(url, filterParams, columns) {
  const tableData = ref([])
  const page = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50]
  })
  const sortState = computed(() => {
    const stateObj = {}
    columns.forEach((item) => {
      if (item.sortable) {
        const key = item.key + 'Order'
        stateObj[key] = item.sortType ? TableV2SortOrder[item.sortType] : TableV2SortOrder.ASC
      }
    })
    return stateObj
  })
  const loading = ref(false)
  const onQueryTableData = (sort = sortState) => {
    loading.value = true
    if (page.value.currentPage > 1 && (page.value.currentPage - 1) * page.value.pageSize < page.value.total) {
      page.value.currentPage--
    }
    const querySort = isRef(sort) ? toValue(sort) : sort
    const params = { currentPage: page.value.currentPage, pageSize: page.value.pageSize, ...toValue(filterParams), ...querySort }
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
  const onSort = (sortState) => {
    const stateObj = {}
    for (let key in sortState) {
      const newkey = key + 'Order'
      stateObj[newkey] = sortState[key]
    }
    onQueryTableData(stateObj)
  }
  //  批量删除功能
  const deleteIds = ref([])
  const onHandleMultiDel = () => {
    ElMessageBox.confirm('确定删除所选数据吗?')
      .then(() => {
        http.delete(url, { data: { ids: deleteIds.value } }).then(() => {
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
        http.delete(url, { data: { ids: [row.id] } }).then(() => {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          onQueryTableData()
        })
      })
      .catch(() => {})
  }
  return { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel, onSort }
}
