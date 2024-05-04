<template>
  <div ref="superTable2" class="super-table-v2">
    <div ref="header" class="header">
      <div class="header-operations">
        <template v-if="operations && operations.length > 0">
          <template v-for="operation in operations">
            <el-button :type="operation.type" :icon="operation.icon" :disabled="operation.disabled" @click="operation.click">{{ operation.text }}</el-button>
          </template>
        </template>
      </div>
      <Filters :filters="filters" @handle-filter="handleFilter" @filter-value-change="filterValueChange"> </Filters>
    </div>
    <TableContent :height="height" :columns="columns" :tableData="tableData" :loading="loading"></TableContent>
    <el-pagination
      ref="tablePagination"
      class="table_pagination"
      background
      :current-page="page.currentPage"
      :page-size="page.pageSize"
      :page-sizes="pageSizes"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
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
const pageSizes = props.page.pageSizes ? props.page.pageSizes : [10, 20, 30, 50]
// 设置 table 高度撑开页面
const superTable2 = ref()
const header = ref()
const tablePagination = ref()
const height = ref(0)
onMounted(() => {
  height.value = superTable2.value.clientHeight - header.value.clientHeight - 52
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
  margin: 10px 30px 20px 30px;
  .header {
    display: flex;
    justify-content: space-between;
    .header-operations {
      flex-shrink: 0;
    }
  }
  .table_pagination {
    margin-top: 20px;
    justify-content: right;
  }
}
</style>
