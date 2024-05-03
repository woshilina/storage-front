<template>
  <div class="table-content" style="height: 600px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="tableData" :width="width" :height="height">
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
import { Loading as LoadingIcon } from '@element-plus/icons-vue'
defineProps(['tableData', 'columns', 'loading'])
</script>
<style lang="scss"></style>
