<template>
  <div class="super-table">
    <SearchForm :columns="option.columns" v-model:search="search" @search-change="searchChange" @search-reset="resetChange">
      <template #column="{ prop }">
        <slot :name="prop + '-search'"></slot>
      </template>
    </SearchForm>
    <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    <TableContent :option="option" :columns="columns" :data="data" :page="page" @selection-change="selectionChange" @handle-del="handleDel" @handle-edit="handleEdit">
      <!-- <template #default="scope"></template> -->
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
    <TableDialog v-if="isOpenDialog" v-model="form" :columns="option.columns" @add-save="addSave" @edit-save="editSave" @close-dialog="closeDialog"></TableDialog>
  </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import SearchForm from './search-form.vue'
import TableContent from './table-content.vue'
import TableDialog from './table-dialog.vue'
import { ref, computed } from 'vue'
const search = defineModel('search')
const page = defineModel('page')
const form = defineModel('form')
const { option, data } = defineProps(['option', 'data'])
const columns = computed(() => {
  return option.columns.map((col) => {
    if (!col.formatter && col.type == 'select') {
      col.formatter = formatter
    }
    return col
  })
})
const formatter = (col, value) => {
  for (let dic of col.dicData) {
    if (dic.value == value) return dic.label
  }
}
const emit = defineEmits(['onLoad', 'rowSave', 'rowEdit', 'getFormItems'])
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
const handleEdit = (index, row) => {
  form.value.id = row.id
  emit('getFormItems', row.id)
  isOpenDialog.value = true
}

const addSave = (form) => {
  emit('rowSave', form.value, closeDialog)
}
const editSave = (form) => {
  emit('rowEdit', form.value, closeDialog)
}
//点击行删除
const handleDel = (index, row) => {
  emit('rowDel', index, row)
}
const closeDialog = () => {
  isOpenDialog.value = false
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
  padding: 30px;
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
