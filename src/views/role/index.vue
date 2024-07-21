<template>
  <SuperTable
    :operations="operations"
    :filters="filters"
    :columns="columns"
    :tableData="tableData"
    :page="page"
    :loading="loading"
    @on-handle-filter="onHandleFilter"
    @on-handle-columns="onHandleColumns"
    @filter-value-change="onFilterValueChange"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  >
  </SuperTable>
  <RoleDialog v-if="isOpenDialog" :item-id="itemId" @query-table-data="onQueryTableData" @close-dialog="closeDialog"></RoleDialog>
</template>
<script lang="jsx" setup>
import SuperTable from '@/components/super-table-v2/super-table.vue'
import RoleDialog from './RoleDialog.vue'
import { ref, reactive, unref, withModifiers, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useSuperTable } from '@/components/super-table-v2/super-table'
import { usePermissionStore } from '@/stores/permission'
const permissionStore = usePermissionStore()
onMounted(() => {
  permissionStore.setPermissions()
})
const url = '/api/v1/roles'
const filters = ref([
  {
    label: '角色名',
    prop: 'name',
    type: 'input',
    width: 200,
    value: ''
  }
])
// 过滤参数
const filterParams = computed(() => {
  return {
    name: filters.value[0].value
  }
})
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
      code: 'role:add',
      click: onHandleAdd
    },
    {
      type: 'danger',
      disabled: multiDelBtnDisable.value,
      text: '批量删除',
      code: 'role:delete',
      click: onHandleMultiDel
    }
  ]
})

const SelectionCell = ({ value, intermediate = false, onChange }) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
}

const columns = reactive([
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
    key: 'name',
    title: '角色名',
    dataKey: 'name',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'remark',
    title: '备注',
    dataKey: 'remark',
    width: 200,
    align: 'center'
  },
  {
    key: 'operations',
    title: '操作',
    cellRenderer: ({ rowIndex, rowData }) => (
      <div>
        <ElButton size="small" type="primary" v-permission="role:edit" onClick={withModifiers(() => onHandleEdit(rowIndex, rowData), ['stop'])}>
          Edit
        </ElButton>
        <ElButton size="small" type="danger" v-permission="role:delete" onClick={withModifiers(() => rowDel(rowIndex, rowData), ['stop'])}>
          Delete
        </ElButton>
      </div>
    ),
    width: 250,
    flexGrow: 1,
    align: 'center'
  }
])
const { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel, onHandleColumns } = useSuperTable(url, filterParams, columns)
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
