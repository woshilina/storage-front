<template>
  <div class="table-content" :style="{ height: height + 'px' }">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 v-model:expanded-row-keys="expandedRowKeys" :columns="columns" :data="tableData" :width="width" :height="height" :expand-column-key="expandColumnKey">
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
import { ref } from 'vue'
import { Loading as LoadingIcon } from '@element-plus/icons-vue'
defineProps(['tableData', 'columns', 'loading', 'height', 'expandColumnKey'])
const expandedRowKeys = ref([])
</script>
<style lang="scss"></style>
