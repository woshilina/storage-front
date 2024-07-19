<template>
  <el-card style="height: 100%">
    <SuperTable
      :operations="operations"
      :filters="filters"
      :columns="columns"
      :tableData="tableData"
      :page="page"
      :loading="loading"
      @on-sort="onSort"
      @on-handle-filter="onHandleFilter"
      @filter-value-change="onFilterValueChange"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    >
    </SuperTable>
  </el-card>
  <GoodsDialog v-if="isOpenDialog" :item-id="itemId" @query-table-data="onQueryTableData" @close-dialog="closeDialog"></GoodsDialog>
</template>
<script lang="jsx" setup>
import SuperTable from '@/components/super-table-v2/super-table.vue'
import GoodsDialog from './GoodsDialog.vue'
import { ref, reactive, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { checkAge } from '@/utils/validate.js'
import { useSuperTable } from '@/components/super-table-v2/super-table'
const url = '/api/v1/goods'
const filters = ref([
  {
    label: '名称',
    prop: 'name',
    type: 'input',
    width: 200,
    value: ''
  },
  {
    label: '规格',
    prop: 'specification',
    type: 'input',
    width: 200,
    value: ''
    // dicData: [
    //   { label: '男', value: '1' },
    //   { label: '女', value: '2' }
    // ]
  },
  {
    label: '数量',
    prop: 'quantity',
    type: 'numberrange',
    width: 250,
    value: '',
    rules: [{ validator: checkAge, trigger: 'blur' }]
  }
  // {
  //   label: '日期范围',
  //   prop: 'dateRange',
  //   type: 'daterange',
  //   width: 350,
  //   value: ''
  // }
])
// 过滤参数
const filterParams = computed(() => {
  return {
    name: filters.value[0].value,
    specification: filters.value[1].value,
    startQuantity: filters.value[2].value.length == 2 ? filters.value[2].value[0] : null,
    endQuantity: filters.value[2].value.length == 2 ? filters.value[2].value[1] : null
    // startDate: filters.value[3].value.length == 2 ? filters.value[3].value[0] : null,
    // endDate: filters.value[3].value.length == 2 ? filters.value[3].value[1] : null
  }
})
const operations = computed(() => {
  return [
    {
      type: 'primary',
      disabled: false,
      icon: Plus,
      text: '新增',
      code: 'goods:add',
      click: onHandleAdd
    },
    {
      type: 'danger',
      disabled: multiDelBtnDisable.value,
      text: '批量删除',
      code: 'goods:delete',
      click: onHandleMultiDel
    }
  ]
})
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
    sortable: true,
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'specification',
    title: '规格',
    dataKey: 'specification',
    width: 100,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'quantity',
    title: '数量',
    dataKey: 'quantity',
    sortable: true,
    // sortType: 'asc',
    width: 100,
    align: 'center'
    // dicData: [
    //   { label: '男', value: '1' },
    //   { label: '女', value: '2' }
    // ],
    // cellRenderer: ({ cellData: sex, column: column }) => {
    //   for (let dic of column.dicData) {
    //     if (dic.value == sex) return dic.label
    //   }
    // }
  },
  {
    key: 'weight',
    title: '重量',
    dataKey: 'weight',
    width: 200,
    align: 'center'
  },
  {
    key: 'remark',
    title: '备注',
    dataKey: 'remark',
    width: 150,
    flexGrow: 1,
    align: 'center'
  },
  {
    key: 'operations',
    title: '操作',
    cellRenderer: ({ rowIndex, rowData }) => (
      <div>
        <ElButton size="small" v-permission="goods:edit" onClick={withModifiers(() => onHandleEdit(rowIndex, rowData), ['stop'])}>
          Edit
        </ElButton>
        <ElButton size="small" type="danger" v-permission="goods:delete" onClick={withModifiers(() => rowDel(rowIndex, rowData), ['stop'])}>
          Delete
        </ElButton>
      </div>
    ),
    width: 150,
    flexGrow: 1,
    align: 'center'
  }
]

const { tableData, page, loading, onQueryTableData, onHandleFilter, onSizeChange, onCurrentChange, deleteIds, onHandleMultiDel, rowDel, onSort } = useSuperTable(url, filterParams, columns)
const itemId = ref('')
const isOpenDialog = ref(false)
const onHandleAdd = () => {
  itemId.value = ''
  isOpenDialog.value = true
}

const multiDelBtnDisable = computed(() => {
  return deleteIds.value.length == 0 ? true : false
})

const SelectionCell = ({ value, intermediate = false, onChange }) => {
  return <ElCheckbox onChange={onChange} modelValue={value} indeterminate={intermediate} />
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
