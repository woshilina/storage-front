<template>
  <SuperTable
    :operations="operations"
    :filters="filters"
    :columns="columns"
    :tableData="tableData"
    :page="page"
    :loading="loading"
    @handle-filter="onHandleFilter"
    @filter-value-change="onFilterValueChange"
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  >
  </SuperTable>
  <PersonDialog v-if="isOpenDialog" :item-id="itemId" @query-table-data="onQueryTableData" @close-dialog="closeDialog"></PersonDialog>
</template>
<script lang="jsx" setup>
import SuperTable from '@/components/super-table-v2/super-table.vue'
import PersonDialog from './PersonDialog.vue'
import { ref, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { checkAge } from '@/utils/validate.js'
import { useSuperTable } from '@/utils/super-table'
const getTableDataUrl = '/api/v1/personnel/all'
const deleteDataUrl = '/api/v1/personnel/multi'
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]
const filters = ref([
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    width: 200,
    value: ''
  },
  {
    label: '性别',
    prop: 'sex',
    type: 'select',
    width: 160,
    value: '',
    dicData: [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ]
  },
  {
    label: '年龄',
    prop: 'age',
    type: 'agerange',
    width: 250,
    value: '',
    rules: [{ validator: checkAge, trigger: 'blur' }]
  },
  {
    label: '日期范围',
    prop: 'dateRange',
    type: 'daterange',
    width: 350,
    value: '',
    shortcuts: shortcuts
  }
])
// 过滤参数
const filterParams = computed(() => {
  return {
    name: filters.value[0].value,
    sex: filters.value[1].value,
    startAge: filters.value[2].value.length == 2 ? filters.value[2].value[0] : null,
    endAge: filters.value[2].value.length == 2 ? filters.value[2].value[1] : null,
    startDate: filters.value[3].value.length == 2 ? filters.value[3].value[0] : null,
    endDate: filters.value[3].value.length == 2 ? filters.value[3].value[1] : null
  }
})
const { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel } = useSuperTable(getTableDataUrl, filterParams, deleteDataUrl)
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
    title: '姓名',
    dataKey: 'name',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'age',
    title: '年龄',
    dataKey: 'age',
    width: 100,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'sex',
    title: '性别',
    dataKey: 'sex',
    width: 100,
    align: 'center',
    dicData: [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ],
    cellRenderer: ({ cellData: sex, column: column }) => {
      for (let dic of column.dicData) {
        if (dic.value == sex) return dic.label
      }
    }
  },
  {
    key: 'IDNo',
    title: '身份证号码',
    dataKey: 'IDNo',
    width: 200,
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
    key: 'avatar',
    title: '头像',
    dataKey: 'avatar',
    width: 150,
    flexGrow: 1,
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
