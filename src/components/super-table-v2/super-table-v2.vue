<template>
  <div class="super-table-v2">
    <div>
      <div class="top-filter">
        <div class="top-btn">
          <template v-if="operations && operations.length > 0">
            <template v-for="btn in operations">
              <el-button :type="btn.type" :icon="btn.icon" :disabled="btn.disabled" @click="btn.click">{{ btn.text }}</el-button>
            </template>
          </template>
        </div>
        <SearchFormV2 :filters="filters" :search="search" @handle-filter="handleFilter" @search-reset="resetChange" @search-change="searchChange">
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
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- <TableDialog v-if="isOpenDialog" v-model="form" :columns="option.columns" @add-save="addSave" @edit-save="editSave" @close-dialog="closeDialog"></TableDialog> -->
  </div>
</template>
<script setup>
import TableContentV2 from './table-content-v2.vue'
import { ElButton } from 'element-plus'
import SearchFormV2 from './search-form-v2.vue'
const props = defineProps({
  filters: { type: Array },
  columns: { type: Array },
  data: { type: Array },
  deleteIds: { type: Array },
  search: { type: Object },
  page: { type: Object },
  operations: {}
})

const emit = defineEmits(['onLoad', 'handleEdit', 'handleAdd', 'handleMultiDel', 'searchChange', 'handleFilter', 'currentChange', 'sizeChange'])
function handleFilter() {
  emit('handleFilter')
}
const handleMultiDel = () => {
  emit('handleMultiDel')
}
const searchChange = (value, columnProp) => {
  emit('searchChange', value, columnProp)
}
function resetChange() {
  // 清空自定义搜索字段
  Object.keys(props.search).forEach((key) => {
    if (props.search[key] || props.search[key] == 0) {
      props.search[key] = undefined
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
const sizeChange = (val) => {
  emit('sizeChange', val)
}
const currentChange = (val) => {
  emit('currentChange', val)
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
