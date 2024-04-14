<template>
  <div class="super-table">
    <SearchForm :columns="option.columns" v-model:search="search" @search-change="searchChange" @search-reset="resetChange">
      <template #age-search>
        <div class="inputrange">
          <el-input v-model.number="search.fromAge" placeholder="起始年龄" clearable />
          <div class="inputrange_line">-</div>
          <el-input v-model.number="search.toAge" placeholder="终止年龄" clearable />
        </div>
      </template>
    </SearchForm>
    <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    <TableContent :option="option" :data="data" :page="page">
      <template #sex="scope">
        <div>{{ scope.row.sex == '1' ? '男' : '女' }}ii</div>
      </template>
    </TableContent>
  </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import SearchForm from './search-form.vue'
import TableContent from './table-content.vue'

import { reactive } from 'vue'
const search = reactive({})
const data = [
  { name: 'xx', sex: '1', age: 23 },
  { name: '2xx', sex: '2', age: 3 }
]
const page = {
  total: 1000,
  currentPage: 1,
  pageSize: 10
}
const option = {
  index: true,
  menu: true,
  selection: true,
  columns: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input',
      search: true
    },
    {
      label: '性别',
      prop: ' sex',
      type: 'select',
      search: true,
      dicData: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ]
    },
    {
      label: '年龄',
      prop: 'age',
      type: 'input',
      search: true
    }
    // {
    //   label: '年龄',
    //   prop: 'age',
    //   type: 'input',
    //   search: true
    // }
  ]
}
function searchChange() {
  console.log(111, search)
}
function resetChange() {
  console.log('reset', search)
}
function handleAdd() {}
</script>
<style lang="scss">
.super-table {
  margin: 30px;
  .inputrange {
    display: inline-flex;
    flex-grow: 1;

    .inputrange_line {
      margin: 0 8px;
    }
  }
}
</style>
