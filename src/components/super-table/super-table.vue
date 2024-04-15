<template>
  <div class="super-table">
    <SearchForm :columns="option.columns" v-model:search="search" @search-change="searchChange" @search-reset="resetChange">
      <template #age-search>
        <div class="inputrange">
          <el-input v-model.number="search.fromAge" placeholder="起始年龄" clearable />
          <div class="inputrange_line">-</div>
          <el-input v-model.number="search.toAge" placeholder="终止年龄" clearable />
        </div>
      </template>
    </SearchForm>
    <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    <TableContent :option="option" :data="data" :page="page" @selection-change="selectionChange" @row-del="rowDel">
      <template #sex="scope">
        <span>{{ scope.row.sex == '1' ? '男' : '女' }}</span>
      </template>
    </TableContent>
    <el-pagination
      class="table_pagination"
      background
      v-model:current-page="page.currentPage"
      v-model:page-size="page.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <TableDialog v-if="isOpenDialog" v-model="form" :columns="option.columns" @row-save="rowSave" @row-edit="rowEdit" @close-dialog="closeDialog"></TableDialog>
  </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import SearchForm from './search-form.vue'
import TableContent from './table-content.vue'
import TableDialog from './table-dialog.vue'
import http from '@/utils/request.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
const search = defineModel('search')
const { option, data } = defineProps(['option', 'data'])
const page = defineModel('page')
const emit = defineEmits('onLoad')
const form = reactive({})
const isOpenDialog = ref(false)

function searchChange() {
  emit('onLoad')
}
function resetChange() {
  // 清空自定义搜索字段
  Object.keys(search).forEach((key) => {
    if (search[key] || search[key] == 0) {
      search[key] = ''
    }
  })
  emit('onLoad')
}
// 多选
const multipleSelection = ref([])
function selectionChange(val) {
  multipleSelection.value = val
}
//点击新增
const handleAdd = () => {
  isOpenDialog.value = true
}

//点击行编辑
// const handleEdit = (index, row) => {
//   isOpenDialog.value = true
//   formId.value = row.id
// }
const closeDialog = () => {
  isOpenDialog.value = false
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
          emit('onLoad')
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
const handleSizeChange = (val) => {
  page.value.pageSize = val
  emit('onLoad')
}
const handleCurrentChange = (val) => {
  page.value.currentPage = val
  emit('onLoad')
}
</script>
<style lang="scss">
.super-table {
  margin: 30px;
  .inputrange {
    display: inline-flex;
    flex-grow: 1;

    .inputrange_line {
      margin: 0 8px;
    }
  }
  .table_pagination {
    margin: 20px;
    justify-content: right;
  }
}
</style>
