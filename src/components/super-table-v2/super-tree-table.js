import { ref, toValue, onMounted } from 'vue'
import http from '@/utils/http.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

export function useSuperTreeTable(url, filterParams, columns) {
  const tableData = ref([])
  const loading = ref(false)
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
  const onQueryTableData = () => {
    loading.value = true
    const params = { ...toValue(filterParams) }
    http
      .get(url, { params })
      .then((res) => {
        tableData.value = res.data
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
    onQueryTableData()
  }

  //  批量删除功能
  const deleteIds = ref([])
  const onHandleMultiDel = () => {
    ElMessageBox.confirm('若含有子节点，将被一起删除，确定删除所选数据吗?')
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
    if (row.children && row.children.length > 0) {
      ElMessageBox.confirm('此行数据含有的子节点将被一起删除，确定删除吗?')
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
    } else {
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
  }
  return { tableData, loading, onQueryTableData, onHandleFilter, deleteIds, onHandleMultiDel, rowDel, onHandleColumns }
}
