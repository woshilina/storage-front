import { ref, isRef, toValue, onMounted, computed } from 'vue'
import http from '@/utils/http.js'
import { TableV2SortOrder } from 'element-plus'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

export function useSuperTable(url, filterParams, columns) {
  const tableData = ref([])
  const page = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50]
  })
  const route = useRoute()

  const onHandleColumns = () => {
    const localStoreItem = route.name + '-columns'
    const storedChecked = localStorage.getItem(localStoreItem)
    if (storedChecked) {
      const storedCheckedColumns = storedChecked.split(',')
      columns.forEach((item) => {
        if (item.name && storedCheckedColumns.includes(item.name)) {
          item.hidden = false
        } else if (item.key && storedCheckedColumns.includes(item.key)) {
          item.hidden = false
        } else {
          item.hidden = true
        }
      })
    }
  }
  onHandleColumns()
  const sortState = computed(() => {
    const stateObj = columns.find((item) => item.sortable)
    if (stateObj) {
      const order = stateObj.sortType ? TableV2SortOrder[stateObj.sortType] : TableV2SortOrder.ASC
      return { sortBy: stateObj.key, orderBy: order.toUpperCase() }
    } else {
      return {}
    }
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
  const onSort = (key, order) => {
    onQueryTableData({ sortBy: key, orderBy: order.toUpperCase() })
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
  return { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel, onSort, onHandleColumns }
}
