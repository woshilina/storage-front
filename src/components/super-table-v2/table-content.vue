<template>
  <div class="table-content" :style="{ height: height + 'px' }">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          v-model:expanded-row-keys="expandedRowKeys"
          :columns="columns"
          v-model:sort-state="sortState"
          @column-sort="onSort"
          :data="tableData"
          :width="width"
          :height="height"
          :expand-column-key="expandColumnKey"
        >
          <template #overlay v-if="loading">
            <div class="el-loading-mask" style="display: flex; align-items: center; justify-content: center">
              <el-icon class="is-loading" color="var(--el-color-primary)" :size="36">
                <loading-icon />
              </el-icon>
            </div>
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { TableV2SortOrder } from 'element-plus'
import { Loading as LoadingIcon } from '@element-plus/icons-vue'
const props = defineProps(['tableData', 'columns', 'loading', 'height', 'expandColumnKey', 'sortState'])
const emits = defineEmits(['onSort'])
const sortState = computed(() => {
  const stateObj = reactive({})
  props.columns.forEach((item) => {
    if (item.sortable) {
      const key = item.key
      stateObj[key] = item.sortType ? TableV2SortOrder[item.sortType] : TableV2SortOrder.ASC
    }
  })
  return stateObj
})
const onSort = ({ key, order }) => {
  sortState.value[key] = order
  emits('onSort')
}
const expandedRowKeys = ref([])
</script>
<style lang="scss"></style>
