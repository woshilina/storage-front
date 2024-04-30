<template>
  {{ userStore.userInfo.username }}<el-button @click="goOut">退出</el-button>
  <SuperTableV2
    :operations="operations"
    :filters="filters"
    :columns="columns"
    :data="data"
    :page="page"
    @handle-filter="handleFilter"
    @search-change="searchChange"
    @on-load="onLoad"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  >
  </SuperTableV2>
  <PersonDialog v-if="isOpenDialog" :form-id="formId" @on-load="onLoad" @close-dialog="closeDialog"></PersonDialog>
</template>
<script lang="jsx" setup>
import SuperTableV2 from '@/components/super-table-v2/super-table-v2.vue'
import PersonDialog from './PersonDialog.vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ref, reactive, onMounted, unref, withModifiers, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, ElButton } from 'element-plus'
import { checkAge } from '@/utils/validate.js'
import http from '@/utils/request.js'
const userStore = useUserStore()
const router = useRouter()
const formId = ref('')
const isOpenDialog = ref(false)
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
      click: handleMultiDel
    }
  ]
})

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
    type: 'radio',
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
    value: [],
    rules: [{ validator: checkAge, trigger: 'blur' }]
  },
  {
    label: '日期',
    prop: 'date',
    type: 'date',
    width: 200,
    value: ''
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

function onLoad() {
  const queryParams = {}
  filters.value.forEach((item) => {
    if (item.value !== '') {
      queryParams[item.prop] = item.value
    }
  })
  const params = { currentPage: page.currentPage, pageSize: page.pageSize, ...queryParams }
  http
    .get('/api/v1/personnel/all', { params })
    .then((res) => {
      data.value = res.data.data
      page.total = res.data.total
    })
    .catch(() => {})
}

onMounted(() => {
  onLoad()
})
const searchChange = (value, columnProp) => {
  for (let item of filters.value) {
    if (item.prop == columnProp) {
      item.value = value
      break
    }
  }
}
const handleFilter = () => {
  page.currentPage = 1
  onLoad()
}
const handleSizeChange = (val) => {
  page.pageSize = val
  onLoad()
}
const handleCurrentChange = (val) => {
  page.currentPage = val
  onLoad()
}
const onHandleEdit = (index, row) => {
  isOpenDialog.value = true
  formId.value = row.id
}
const closeDialog = () => {
  isOpenDialog.value = false
}
// 点击行删除
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
const goOut = () => {
  userStore.clearUserInfo()
  // 跳转到登录页面
  router.push('/login')
}
</script>
<style lang="scss"></style>
