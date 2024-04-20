<template>
  <div class="super-table-v2">
    <div>
      <div class="top-filter">
        <div class="top-btn">
          <el-button type="primary" v-if="addBtn" :icon="Plus" @click="handleAdd">新增</el-button>
          <el-button type="danger" v-if="multiDelBtn" :disabled="deleteIds.length == 0" @click="handleMultiDel">批量删除</el-button>
          <slot name="left-btn"></slot>
        </div>
        <SearchFormV2 :filters="filters" :search="search" @search-change="handleSearch" @search-reset="resetChange">
          <template #column="{ prop }">
            <slot :name="prop + '-search'"></slot>
          </template>
        </SearchFormV2>
      </div>
      <TableContentV2 :columns="columns" :data="data" @handle-del="handleDel" @handle-edit="handleEdit"> </TableContentV2>
    </div>
    <el-pagination
      class="table_pagination"
      background
      :current-page="page.currentPage"
      :page-size="page.pageSize"
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
import TableContentV2 from './table-content-v2.vue'
import { ElButton } from 'element-plus'
import SearchFormV2 from './search-form-v2.vue'
const { filters, columns, data, addBtn, multiDelBtn, deleteIds, search, page } = defineProps({
  filters: { type: Array },
  columns: { type: Array },
  data: { type: Array },
  addBtn: { default: true },
  multiDelBtn: { default: true },
  deleteIds: { type: Array },
  search: { type: Object },
  page: { type: Object }
})
const emit = defineEmits(['onLoad', 'handleEdit', 'handleAdd', 'handleMultiDel'])
function handleSearch() {
  page.currentPage = 1
  emit('onLoad')
}
const handleMultiDel = () => {
  emit('handleMultiDel')
}
function resetChange() {
  // 清空自定义搜索字段
  Object.keys(search).forEach((key) => {
    if (search[key] || search[key] == 0) {
      search[key] = undefined
    }
  })
  emit('onLoad')
}
//点击新增
const handleAdd = () => {
  emit('handleAdd')
}
const handleEdit = (index, row) => {
  emit('handleEdit', index, row)
}

//点击行删除
const handleDel = (index, row) => {
  emit('rowDel', index, row)
}

const handleSizeChange = (val) => {
  page.pageSize = val
  emit('onLoad')
}
const handleCurrentChange = (val) => {
  page.currentPage = val
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
