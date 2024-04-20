<template>
  <div class="super-table-v2">
    <div>
      <div class="top-filter">
        <div class="top-btn">
          <el-button type="primary" v-if="addBtn" :icon="Plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" v-if="multiDelBtn" @click="handleMultiDel">批量删除</el-button>
          <slot name="left-btn"></slot>
        </div>
        <SearchForm :searchColumns="searchColumns" v-model:search="search" @search-change="searchChange" @search-reset="resetChange">
          <template #column="{ prop }">
            <slot :name="prop + '-search'"></slot>
          </template>
        </SearchForm>
      </div>
      <TableContentV2 :columns="columns" :data="data" @handle-del="handleDel" @handle-edit="handleEdit"> </TableContentV2>
    </div>
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
    <!-- <TableDialog v-if="isOpenDialog" v-model="form" :columns="option.columns" @add-save="addSave" @edit-save="editSave" @close-dialog="closeDialog"></TableDialog> -->
  </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import SearchForm from './search-form.vue'
import TableContentV2 from './table-content-v2.vue'
import { ElButton } from 'element-plus'
const search = defineModel('search')
const page = defineModel('page')
const { searchColumns, columns, data, addBtn, multiDelBtn } = defineProps({
  searchColumns: { type: Array },
  columns: { type: Array },
  data: { type: Array },
  addBtn: { default: true },
  multiDelBtn: { default: true }
})

const emit = defineEmits(['onLoad', 'handleEdit', 'handleAdd','handleMultiDel'])
function searchChange() {
  emit('onLoad')
}
const handleMultiDel = () => {
  emit('handleMultiDel')
}
function resetChange() {
  // 清空自定义搜索字段
  Object.keys(search.value).forEach((key) => {
    if (search.value[key] || search.value[key] == 0) {
      search.value[key] = undefined
    }
  })
  console.log(search)
  emit('onLoad')
}
//点击新增
const handleAdd = () => {
  emit('handleAdd')
}
const handleEdit = (index, row) => {
  emit('handleEdit', index, row)
}

// const addSave = (form) => {
//   emit('rowSave', form.value, closeDialog)
// }
// const editSave = (form) => {
//   emit('rowEdit', form.value, closeDialog)
// }
//点击行删除
const handleDel = (index, row) => {
  emit('rowDel', index, row)
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
.super-table-v2 {
  height: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top-filter {
    display: flex;
    justify-content: space-between;
    .top-btn {
      flex-shrink: 0;
    }
    .inputrange {
      display: inline-flex;
      flex-grow: 1;

      .inputrange_line {
        margin: 0 8px;
      }
    }
  }

  .table_pagination {
    margin: 20px;
    justify-content: right;
  }
}
</style>
