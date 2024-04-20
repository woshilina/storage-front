<template>
  <SuperTableV2
    :columns="columns"
    :filters="filters"
    :data="data"
    :btns="btns"
    :search="search"
    :deleteIds="deleteIds"
    :page="page"
    @handle-filter="handleFilter"
    @search-change="searchChange"
    @on-load="onLoad"
    @row-del="rowDel"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
    <template #age-search>
      <div class="inputrange">
        <el-input v-model.number="search.fromAge" placeholder="起始年龄" clearable />
        <div class="inputrange_line">-</div>
        <el-input v-model.number="search.toAge" placeholder="终止年龄" clearable />
      </div>
    </template>
  </SuperTableV2>
  <PersonDialog v-if="isOpenDialog" :form-id="formId" @on-load="onLoad" @close-dialog="closeDialog"> </PersonDialog>
</template>
<script lang="jsx" setup>
import { ref, reactive, onMounted, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import http from '@/utils/request.js'
import { ElMessageBox, ElMessage, ElButton } from 'element-plus'
import PersonDialog from './PersonDialog.vue'
const formId = ref('')
const isOpenDialog = ref(false)
const search = reactive({})
const checkAge = (rule, value, callback) => {
  if (!search.fromAge && !search.toAge) {
    callback()
  } else if (!search.fromAge || !search.toAge) {
    return callback(new Error('请完整输入年龄范围'))
  } else if (!Number.isInteger(search.fromAge) || !Number.isInteger(search.toAge)) {
    return callback(new Error('请输入整数'))
  } else if (search.fromAge > search.toAge) {
    return callback(new Error('起始年龄应不大于终止年龄'))
  } else {
    callback()
  }
}
const page = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10
})
const data = ref([])
const deleteIds = ref([])
const onHandleAdd = () => {
  formId.value = ''
  isOpenDialog.value = true
}
const handleMultiDel = () => {
  if (deleteIds.value.length == 0) {
    ElMessage.error('请选择要删除的数据')
  } else {
    ElMessageBox.confirm('确定删除所选数据吗?')
      .then(() => {
        http.delete(`/api/v1/personnel/multi`, { data: { ids: deleteIds.value } }).then((res) => {
          if (res.data.status == '200') {
            ElMessage({
              message: '删除成功',
              type: 'success'
            })
            onLoad()
          } else {
            ElMessage({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      })
      .catch(() => {
        // catch error
      })
  }
}
const multiDelBtnDisable = () => {
 return deleteIds.value.length == 0 ? true : false
}
const btns = [
  {
    type: 'primary',
    disabled: false,
    icon: Plus,
    text: '新增',
    click: onHandleAdd
  },
  {
    type: 'danger',
    disabled: multiDelBtnDisable,
    text: '批量删除',
    click: handleMultiDel
  }
]
const filters = [
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    width: 200,
    rules: [
      {
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }
    ]
  },
  {
    label: '性别',
    prop: 'sex',
    type: 'select',
    width: 140,
    rules: [
      {
        required: true,
        message: '请选择性别',
        trigger: 'blur'
      }
    ],
    dicData: [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ]
  },
  {
    label: '年龄',
    prop: 'age',
    type: 'input',
    width: 250,
    rules: [
      {
        required: true,
        message: '请输入年龄',
        trigger: 'blur'
      }
    ],
    searchRules: [{ validator: checkAge, trigger: 'blur' }]
  }
]
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
      const _data = unref(data)
      const onChange = (value) => {
        data.value = _data.map((row) => {
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
      const allSelected = _data.every((row) => row.checked)
      const containsChecked = _data.some((row) => row.checked)
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
const searchChange = (value, columnProp) => {
  search[columnProp] = value
}
function onLoad() {
  const queryParams = {}
  Object.keys(search).forEach((key) => {
    if (search[key] !== '') {
      queryParams[key] = search[key]
    }
  })
  const params = { currentPage: page.currentPage, pageSize: page.pageSize, ...queryParams }
  http
    .get('/api/v1/personnel/all', { params })
    .then((res) => {
      data.value = res.data.data
      page.total = res.data.total
      // if (res.data.totalPage > 1) {
      //   page.currentPage = 1
      // }
    })
    .catch(() => {})
}
const handleFilter = () => {
  page.currentPage = 1
  onLoad()
}
onMounted(() => {
  onLoad()
})
const handleSizeChange = (val) => {
  page.pageSize = val
  onLoad()
}
const handleCurrentChange = (val) => {
  page.currentPage = val
  onLoad()
}

//点击行编辑
const onHandleEdit = (index, row) => {
  isOpenDialog.value = true
  formId.value = row.id
}

const closeDialog = () => {
  isOpenDialog.value = false
}

//点击行删除
const rowDel = (index, row) => {
  ElMessageBox.confirm('确定删除此行数据吗?')
    .then(() => {
      http.delete(`/api/v1/personnel/multi`, { data: { ids: [row.id] } }).then((res) => {
        if (res.data.status == '200') {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          onLoad()
        } else {
          ElMessage({
            message: '删除失败',
            type: 'error'
          })
        }
      })
    })
    .catch(() => {
      // catch error
    })
}
</script>
<style lang="scss"></style>
