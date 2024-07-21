<template>
  <SuperTable :operations="operations" :columns="columns" :tableData="tableData" @on-handle-columns="onHandleColumns" :expand-column-key="expandColumnKey" :loading="loading"> </SuperTable>
  <PermissionDialog v-if="isOpenDialog" :item-id="itemId" @query-table-data="onQueryTableData" @close-dialog="closeDialog"></PermissionDialog>
</template>
<script lang="jsx" setup>
import SuperTable from '@/components/super-table-v2/super-table.vue'
import PermissionDialog from './PermissionDialog.vue'
import { ref, reactive, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useSuperTreeTable } from '@/components/super-table-v2/super-tree-table'
import { useMenuStore } from '@/stores/permission'
const menuStore = useMenuStore()
menuStore.setMenus()

const expandColumnKey = 'name'
const url = '/api/v1/permissions'
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
      code: 'permission:add',
      click: onHandleAdd
    },
    {
      type: 'danger',
      disabled: multiDelBtnDisable.value,
      text: '批量删除',
      code: 'permission:delete',
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
    title: '名称',
    dataKey: 'name',
    width: 150,
    flexGrow: 1,
    align: 'left'
  },
  // {
  //   key: 'parentName',
  //   title: '上级权限',
  //   dataKey: 'parentName',
  //   width: 150,
  //   flexGrow: 1
  //   // align: 'center'
  // },
  {
    key: 'url',
    title: '路由',
    dataKey: 'url',
    width: 150,
    flexGrow: 1
    // align: 'center'
  },
  {
    key: 'code',
    title: '编码',
    dataKey: 'code',
    width: 150,
    flexGrow: 1
    // align: 'center'
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
        <ElButton size="small" v-permission="permission:edit" onClick={withModifiers(() => onHandleEdit(rowIndex, rowData), ['stop'])}>
          Edit
        </ElButton>
        <ElButton size="small" v-permission="permission:delete" type="danger" onClick={withModifiers(() => rowDel(rowIndex, rowData), ['stop'])}>
          Delete
        </ElButton>
      </div>
    ),
    width: 150,
    flexGrow: 1,
    align: 'center'
  }
])
const { tableData, loading, onQueryTableData, deleteIds, onHandleMultiDel, rowDel, onHandleColumns } = useSuperTreeTable(url, {}, columns)

const onHandleEdit = (index, row) => {
  isOpenDialog.value = true
  itemId.value = row.id
}
const closeDialog = () => {
  isOpenDialog.value = false
}
</script>
<style lang="scss"></style>
