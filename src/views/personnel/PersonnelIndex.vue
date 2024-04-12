<template>
  <div class="person-home">
    <el-form :inline="true" ref="queryRef" :model="query" :rules="queryRules">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="query.name" placeholder="姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="query.sex" placeholder="性别" clearable>
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6">
          <el-form-item label="年龄段" prop="age">
            <div class="inputrange">
              <el-input v-model.number="query.fromAge" placeholder="起始年龄" clearable />
              <div class="inputrange_line">-</div>
              <el-input v-model.number="query.toAge" placeholder="终止年龄" clearable />
            </div>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6">
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
            <el-button @click="onEmpty">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" :index="indexMethod" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <div>{{ scope.row.sex == '1' ? '男' : '女' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" />
      <el-table-column prop="IDNo" label="身份证号码" min-width="120px" />
      <el-table-column prop="email" label="邮箱" min-width="120px" />
      <el-table-column prop="avatar" label="头像" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <Edit style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: #409eff" @click="handleEdit(scope.$index, scope.row)" />
          <Delete style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: red" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="home_pagination"
      background
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <PersonnelDialog v-model:dialog-visible="dialogVisible" :form-id="formId" @get-personnels="getPersonnels"></PersonnelDialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import PersonnelDialog from './PersonnelDialog.vue'
import http from '@/utils/request.js'
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const query = reactive({
  name: '',
  sex: '',
  fromAge: '',
  toAge: ''
})
const formId = ref('')
const dialogVisible = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const indexMethod = (index) => {
  return index + 1 + (currentPage.value - 1) * pageSize.value
}

onMounted(() => {
  getPersonnels()
})

//获取表格数据方法
const getPersonnels = () => {
  const queryParams = {}
  Object.keys(query).forEach((key) => {
    if (query[key] !== '') {
      queryParams[key] = query[key]
    }
  })
  const params = { currentPage: currentPage.value, pageSize: pageSize.value, ...queryParams }
  http.get('/api/v1/personnel/all', { params }).then((res) => {
    tableData.value = res.data.data
    total.value = res.data.total
  })
}

const checkAge = (rule, value, callback) => {
  if (!String(query.fromAge) || !query.toAge) {
    return callback(new Error('请完整输入年龄范围'))
  } else if (!Number.isInteger(query.fromAge) || !Number.isInteger(query.toAge)) {
    return callback(new Error('请输入整数'))
  } else if (query.fromAge > query.toAge) {
    return callback(new Error('起始年龄应不大于终止年龄'))
  } else {
    callback()
  }
}
const queryRules = reactive({
  age: [{ validator: checkAge, trigger: 'blur' }]
})

//查询
const onQuery = () => {
  getPersonnels()
}

//清空查询
const onEmpty = () => {
  Object.keys(query).forEach((key) => {
    if (query[key] || query[key] == 0) {
      query[key] = ''
    }
  })
  getPersonnels()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  getPersonnels()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getPersonnels()
}

//点击新增
const handleAdd = () => {
  formId.value = ''
  dialogVisible.value = true
}

//点击行编辑
const handleEdit = (index, row) => {
  formId.value = row.id
  dialogVisible.value = true
}
//点击行删除
const handleDelete = (index, row) => {
  ElMessageBox.confirm('确定删除此行数据吗?')
    .then(() => {
      http.delete(`/api/v1/personnel/${row.id}`).then((res) => {
        if (res.data.status == '200') {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          getPersonnels()
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
<style lang="scss">
.person-home {
  padding: 30px;

  .el-form-item {
    width: 100%;
  }

  .inputrange {
    display: inline-flex;
    flex-grow: 1;

    .inputrange_line {
      margin: 0 8px;
    }
  }

  .home_pagination {
    margin: 20px;
    justify-content: right;
  }
}
</style>
