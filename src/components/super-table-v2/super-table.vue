<template>
  <div class="super-table-v2">
    <div>
      <div class="header">
        <div class="header-operations">
          <template v-if="operations && operations.length > 0">
            <template v-for="operation in operations">
              <el-button :type="operation.type" :icon="operation.icon" :disabled="operation.disabled" @click="operation.click">{{ operation.text }}</el-button>
            </template>
          </template>
        </div>
        <Filters :filters="filters" @handle-filter="handleFilter" @filter-value-change="filterValueChange"> </Filters>
      </div>
      <TableContent :columns="columns" :tableData="tableData" :loading="loading"></TableContent>
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
  </div>
</template>
<script setup>
import TableContent from './table-content.vue'
import { ElButton } from 'element-plus'
import Filters from './filters.vue'
const props = defineProps({
  filters: { type: Object },
  columns: { type: Array },
  tableData: { type: Array },
  page: { type: Object },
  operations: { type: Array },
  loading: { type: Boolean }
})
const emit = defineEmits(['filterValueChange', 'handleFilter', 'currentChange', 'sizeChange'])
const handleFilter = () => {
  emit('handleFilter')
}
const filterValueChange = (value, columnProp) => {
  emit('filterValueChange', value, columnProp)
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
  flex: 1;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .header {
    display: flex;
    justify-content: space-between;
    .header-operations {
      flex-shrink: 0;
    }
  }
  .table_pagination {
    margin: 20px;
    justify-content: right;
  }
}
</style>
