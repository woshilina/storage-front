<template>
  <SuperTable
    :operations="operations"
    :filters="filters"
    :columns="columns"
    :tableData="tableData"
    :page="page"
    :loading="loading"
    @on-handle-filter="onHandleFilter"
    @filter-value-change="onFilterValueChange"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  >
  </SuperTable>
  <UserDialog v-if="isOpenDialog" :item-id="itemId" @query-table-data="onQueryTableData" @close-dialog="closeDialog"></UserDialog>
</template>
<script lang="jsx" setup>
import SuperTable from '@/components/super-table-v2/super-table.vue'
import UserDialog from './UserDialog.vue'
import http from '@/utils/http.js'
import { ref, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useSuperTable } from '@/components/super-table-v2/super-table'
import { ElMessageBox, ElMessage } from 'element-plus'

const url = '/api/v1/users'
const filters = ref([
  {
    label: '账号',
    prop: 'account',
    type: 'input',
    width: 200,
    value: ''
  }
])
// 过滤参数
const filterParams = computed(() => {
  return {
    account: filters.value[0].value
  }
})
const { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel } = useSuperTable(url, filterParams)
const itemId = ref('')
const isOpenDialog = ref(false)

const onHandleAdd = () => {
  itemId.value = ''
  isOpenDialog.value = true
}

const multiDelBtnDisable = computed(() => {
  return deleteIds.value.length == 0 ? true : false
})

const operations = computed(() => {
  return [
    {
      type: 'primary',
      disabled: false,
      icon: Plus,
      text: '新增',
      click: onHandleAdd
    },
    {
      type: 'danger',
      disabled: multiDelBtnDisable.value,
      text: '批量删除',
      click: onHandleMultiDel
    }
  ]
})

const SelectionCell = ({ value, intermediate = false, onChange }) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const columns = [
  {
    key: 'selection',
    width: 50,
    cellRenderer: ({ rowData }) => {
      const onChange = (value) => {
        rowData.checked = value
        if (value) {
          deleteIds.value.push(rowData.id)
        } else {
          deleteIds.value = deleteIds.value.filter((sel) => sel !== rowData.id)
        }
      }
      return <SelectionCell value={rowData.checked} onChange={onChange} />
    },
    headerCellRenderer: () => {
      const _data = unref(tableData)
      const onChange = (value) => {
        tableData.value = _data.map((row) => {
          row.checked = value
          return row
        })
        if (value) {
          deleteIds.value = []
          _data.forEach((item) => {
            deleteIds.value.push(item.id)
          })
        } else {
          deleteIds.value = []
        }
      }
      // const allSelected = _data.every((row) => row.checked)
      const allSelected = _data.length === deleteIds.value.length
      // const containsChecked = _data.some((row) => row.checked)
      const containsChecked = deleteIds.value.length > 0
      return <SelectionCell value={allSelected} intermediate={containsChecked && !allSelected} onChange={onChange} />
    }
  },
  {
    key: 'account',
    title: '账号',
    dataKey: 'account',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  // {
  //   key: 'password',
  //   title: '密码',
  //   dataKey: 'password',
  //   width: 150,
  //   flexGrow: 1,
  //   align: 'center'
  // },
  {
    key: 'name',
    title: '姓名',
    dataKey: 'name',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'email',
    title: '邮箱',
    dataKey: 'email',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'roles',
    title: '角色',
    dataKey: 'roles',
    cellRenderer: ({ rowIndex, rowData }) => (
      <div>
        {rowData.roles.map((role) => (
          <el-tag type="primary">{role.name}</el-tag>
        ))}
      </div>
    ),
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'operations',
    title: '操作',
    cellRenderer: ({ rowIndex, rowData }) => (
      <div>
        <ElButton size="small" type="primary" onClick={withModifiers(() => onHandleEdit(rowIndex, rowData), ['stop'])}>
          Edit
        </ElButton>
        <ElButton size="small" type="danger" onClick={withModifiers(() => rowDel(rowIndex, rowData), ['stop'])}>
          Delete
        </ElButton>
        <ElButton size="small" type="warning" onClick={withModifiers(() => resetPassword(rowIndex, rowData), ['stop'])}>
          重置密码
        </ElButton>
      </div>
    ),
    width: 250,
    flexGrow: 1,
    align: 'center'
  }
]

const resetPassword = (index, row) => {
  ElMessageBox.confirm('密码将被重置为’123456‘，确定吗?').then(() => {
    http.patch(`/api/v1/users/${row.id}`).then(() => {
      ElMessage({
        message: '重置成功',
        type: 'success'
      })
    })
  })
}

const onFilterValueChange = (value, columnProp) => {
  for (let item of filters.value) {
    if (item.prop == columnProp) {
      item.value = value
      break
    }
  }
}

const onHandleEdit = (index, row) => {
  isOpenDialog.value = true
  itemId.value = row.id
}
const closeDialog = () => {
  isOpenDialog.value = false
}
</script>
<style lang="scss"></style>
