<template>
  <div class="">
    <el-table :data="data" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" v-if="option.selection" width="55" />
      <el-table-column v-if="option.index" type="index" :label="indexText" :index="indexMethod" width="80" />
      <template v-for="column in option.columns" :key="column.prop">
        <el-table-column :prop="column.prop" :label="column.label">
          <!-- <slot :name="column.prop"></slot> -->
        </el-table-column>
      </template>
      <!-- <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <div>{{ scope.row.sex == '1' ? '男' : '女' }}</div>
        </template>
      </el-table-column> -->
      <el-table-column v-if="option.menu" label="操作" width="180">
        <template #default="scope">
          <Edit style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: #409eff" @click="handleEdit(scope.$index, scope.row)" />
          <Delete style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: red" @click="handleDelete(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      class="home_pagination"
      background
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const { option, data, page } = defineProps(['option', 'data', 'page'])
import { Delete, Edit } from '@element-plus/icons-vue'
const indexText = computed(() => {
  return option.indexText ? option.indexText : '序号'
})
const indexMethod = (index) => {
  return index + 1 + (page.currentPage - 1) * page.pageSize
}
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

//点击行编辑
const handleEdit = (index, row) => {
  console.log(index, row)
  // isOpenDialog.value = true
  // formId.value = row.id
}
//点击行删除
const handleDelete = (index, row) => {
  console.log(index, row)

  // isOpenDialog.value = true
  // formId.value = row.id
}
</script>
<style lang="scss"></style>
