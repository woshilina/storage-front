<template>
  <div class="table-content">
    <el-table :data="data" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" v-if="option.selection" width="55" />
      <el-table-column v-if="option.index" type="index" :label="indexText" :index="indexMethod" width="80" />
      <template v-for="column in option.columns" :key="column.prop">
        <el-table-column :prop="column.prop" :label="column.label">
          <template #default="scope">
            <slot :name="column.prop" :row="scope.row">{{ scope.row[column.prop] }}</slot>
          </template>
        </el-table-column>
      </template>
      <el-table-column v-if="option.menu" label="操作" width="180">
        <template #default="scope">
          <Edit style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: #409eff" @click="handleEdit(scope.$index, scope.row)" />
          <Delete style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: red" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const { option, data, page } = defineProps(['option', 'data', 'page'])
import { Delete, Edit } from '@element-plus/icons-vue'
const emit = defineEmits(['onLoad', 'selectionChange', 'handleDel', 'handleEdit'])
const indexText = computed(() => {
  return option.indexText ? option.indexText : '序号'
})
const indexMethod = (index) => {
  return index + 1 + (page.currentPage - 1) * page.pageSize
}
// 多选
const handleSelectionChange = (val) => {
  emit('selectionChange', val)
}

//点击行编辑
const handleEdit = (index, row) => {
  emit('handleEdit', index, row)
}
//点击行删除
const handleDelete = (index, row) => {
  emit('handleDel', index, row)
}
</script>
<style lang="scss"></style>
