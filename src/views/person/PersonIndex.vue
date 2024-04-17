<template>
  <SuperTable
    :option="option"
    :data="data"
    v-model:search="search"
    v-model:form="form"
    v-model:page="page"
    @on-load="onLoad"
    @row-save="rowSave"
    @get-form-items="getFormItems"
    @row-edit="rowEdit"
    @row-del="rowDel"
  >
    <template #age-search>
      <div class="inputrange">
        <el-input v-model.number="search.fromAge" placeholder="起始年龄" clearable />
        <div class="inputrange_line">-</div>
        <el-input v-model.number="search.toAge" placeholder="终止年龄" clearable />
      </div>
    </template>
  </SuperTable>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/utils/request.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const search = reactive({})
const checkAge = (rule, value, callback) => {
  if (!String(search.fromAge) || !search.toAge) {
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
const form = reactive({})
const data = ref([])
const option = reactive({
  index: true,
  menu: true,
  selection: true,
  columns: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input',
      rules: [
        {
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }
      ],
      search: true,
      searchRules: [
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
      rules: [
        {
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }
      ],
      search: true,
    //   formatter: () => {
    //     return '22'
    //   },
      dicData: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ]
    },
    {
      label: '年龄',
      prop: 'age',
      type: 'input',
      rules: [
        {
          required: true,
          message: '请输入年龄',
          trigger: 'blur'
        }
      ],
      search: true,
      searchRules: [{ validator: checkAge, trigger: 'blur' }]
    },
    {
      label: '身份证号码',
      prop: 'IDNo',
      type: 'input'
    },
    {
      label: '邮箱',
      prop: 'email',
      type: 'input'
    },
    {
      label: '头像',
      prop: 'avatar',
      type: 'input'
    }
  ]
})
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
    })
    .catch(() => {})
}
onMounted(() => {
  onLoad()
})
//新增保存
const rowSave = (form, done) => {
  // formLoading.value = true
  http.post('/api/v1/personnel/add', form).then((res) => {
    // formLoading.value = false
    if (res.data.status == '200') {
      done()
      ElMessage({
        message: '新增成功',
        type: 'success'
      })
      onLoad()
    } else {
      ElMessage({
        message: '新增失败',
        type: 'error'
      })
    }
  })
}
const getFormItems = async (id) => {
  await http.get(`/api/v1/personnel/${id}`).then((res) => {
    const { name, sex, age, IDNo, avatar, email } = res.data
    // formLoading.value = false
    form.name = name
    form.sex = sex
    form.age = age
    form.IDNo = IDNo
    form.avatar = avatar
    form.email = email
  })
}
// 编辑保存
const rowEdit = (form, done) => {
  // formLoading.value = true
  const editData = {
    name: form.name,
    age: form.age,
    sex: form.sex,
    IDNo: form.IDNo,
    avatar: form.avatar,
    email: form.email
  }
  http.put(`/api/v1/personnel/${form.id}`, editData).then((res) => {
    if (res.data.status == '200') {
      done()
      ElMessage({
        message: '编辑成功',
        type: 'success'
      })
      onLoad()
    } else {
      ElMessage({
        message: '编辑失败',
        type: 'error'
      })
    }
  })
}
//点击行删除
const rowDel = (index, row) => {
  ElMessageBox.confirm('确定删除此行数据吗?')
    .then(() => {
      http.delete(`/api/v1/personnel/${row.id}`).then((res) => {
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
