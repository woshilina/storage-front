<template>
  <div class="super-table-v2">
    <div>
      <div class="header">
        <div class="header-operations">
          <template v-if="operations && operations.length > 0">
            <template v-for="btn in operations">
              <el-button :type="btn.type" :icon="btn.icon" :disabled="btn.disabled" @click="btn.click">{{ btn.text }}</el-button>
            </template>
          </template>
        </div>
        <Filters :filters="filters" @handle-filter="handleFilter" @search-change="searchChange"> </Filters>
      </div>
      <TableContent :columns="columns" :data="data"></TableContent>
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
  data: { type: Array },
  page: { type: Object },
  operations: {}
})
const emit = defineEmits(['onLoad', 'searchChange', 'handleFilter', 'currentChange', 'sizeChange'])
const handleFilter = () => {
  emit('handleFilter')
}
const searchChange = (value, columnProp) => {
  emit('searchChange', value, columnProp)
}
// const resetChange = () => {
//   // 清空自定义搜索字段
//   Object.keys(props.filters.search).forEach((key) => {
//     if (props.filters.search[key] || props.filters.search[key] == 0) {
//       props.filters.search[key] = undefined
//     }
//   })
//   emit('onLoad')
// }

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
