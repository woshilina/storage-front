<template>
  <el-form class="search-form" :inline="true" ref="queryRef" :model="search" :rules="searchRules">
    <el-row :gutter="20">
      <template v-for="column in columns" :key="column.prop">
        <el-col v-if="column.search" :xs="12" :sm="8" :md="6" :lg="6" :xl="6">
          <el-form-item :label="column.label" :prop="column.prop">
            <slot :name="column.prop + '-search'">
              <el-input v-if="column.type == 'input'" v-model="search[column.prop]" :placeholder="column.label" clearable />
              <el-select v-else-if="column.type == 'select'" v-model="search[column.prop]" :placeholder="column.label" clearable>
                <el-option v-for="dic in column.dicData" :key="dic.label" :label="dic.label" :value="dic.value" />
              </el-select>
            </slot>
          </el-form-item>
        </el-col>
      </template>
      <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6">
        <el-form-item>
          <el-button type="primary" @click="onQuery">查询</el-button>
          <el-button @click="onEmpty">清空</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup>
// import { ref, reactive } from 'vue'

const search = defineModel('search')
const searchRules = []
const { columns } = defineProps(['columns'])
const emit = defineEmits(['searchChange', 'searchReset'])
function onQuery() {
  emit('searchChange')
}
function onEmpty() {
  emit('searchReset')
}
</script>
<style lang="scss">
.search-form {
  .el-form-item {
    width: 100%;
  }
}
</style>
