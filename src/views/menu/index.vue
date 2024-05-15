<template>
  <SuperTable
    :operations="operations"
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
  <MenuDialog v-if="isOpenDialog" :item-id="itemId" @query-table-data="onQueryTableData" @close-dialog="closeDialog"></MenuDialog>
</template>
<script lang="jsx" setup>
import SuperTable from '@/components/super-table-v2/super-table.vue'
import MenuDialog from './MenuDialog.vue'
import { ref, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useSuperTable } from '@/components/super-table-v2/super-table'
const url = '/api/v1/menu'
const { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel } = useSuperTable(url, {})
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
    key: 'name',
    title: '名称',
    dataKey: 'name',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'parentId',
    title: '上级菜单',
    dataKey: 'parentId',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'url',
    title: '路由',
    dataKey: 'url',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'type',
    title: '类型',
    dataKey: 'type',
    width: 100,
    flexGrow: 1,
    align: 'center',
    dicData: [
      { label: '目录', value: '0' },
      { label: '菜单', value: '1' },
      { label: '按钮', value: '2' }
    ],
    cellRenderer: ({ cellData: sex, column: column }) => {
      for (let dic of column.dicData) {
        if (dic.value == sex) return dic.label
      }
    }
  },
  {
    key: 'orderNum',
    title: '排序',
    dataKey: 'orderNum',
    width: 200,
    align: 'center'
  },
  {
    key: 'operations',
    title: '操作',
    cellRenderer: ({ rowIndex, rowData }) => (
      <div>
        <ElButton size="small" onClick={withModifiers(() => onHandleEdit(rowIndex, rowData), ['stop'])}>
          Edit
        </ElButton>
        <ElButton size="small" type="danger" onClick={withModifiers(() => rowDel(rowIndex, rowData), ['stop'])}>
          Delete
        </ElButton>
      </div>
    ),
    width: 150,
    flexGrow: 1,
    align: 'center'
  }
]

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
