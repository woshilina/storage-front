<template>
  <el-form class="search-form-v2" ref="queryRef" :model="search" :rules="searchRules">
    <template v-for="column in filters" :key="column.prop">
      <div :style="{ width: column.width + 'px' }">
        <el-form-item :label="column.label" :prop="column.prop">
          <slot name="column" v-bind="column">
            <el-input v-if="column.type == 'input'" :model-value="search[column.prop]" @input.native="(value) => searchChange(value, column.prop)" :placeholder="column.label" clearable />
            <el-select v-else-if="column.type == 'select'" :model-value="search[column.prop]" @change="(value) => searchChange(value, column.prop)" :placeholder="column.label" clearable>
              <el-option v-for="dic in column.dicData" :key="dic.value" :label="dic.label" :value="dic.value" />
            </el-select>
          </slot>
        </el-form-item>
      </div>
    </template>
    <div class="filter-btn">
      <el-button type="primary" @click="onQuery">查询</el-button>
      <el-button @click="onEmpty">清空</el-button>
    </div>
  </el-form>
</template>
<script setup>
import { ref, computed } from 'vue'
const queryRef = ref()
const props = defineProps(['filters', 'search'])
const searchRules = computed(() => {
  const rules = {}
  props.filters.forEach((col) => {
    if (col.searchRules && col.searchRules.length > 0) {
      rules[col.prop] = col.searchRules
    }
  })
  return rules
})
const emit = defineEmits(['handleFilter', 'searchReset', 'searchChange'])
const searchChange = (value, columnProp) => {
  emit('searchChange', value, columnProp)
}
function onQuery() {
  if (!queryRef.value) return
  queryRef.value.validate((valid, fields) => {
    if (valid) {
      emit('handleFilter')
    } else {
      console.log('error submit!', fields)
    }
  })
}
function onEmpty() {
  if (!queryRef.value) return
  queryRef.value.resetFields()
  emit('searchReset')
}
</script>
<style lang="scss">
.search-form-v2 {
  display: flex;
  flex-wrap: wrap;
  margin-left: 20px;
  .el-form-item {
    width: 100%;
    flex-basis: 250px;
    padding-left: 20px;
  }
  .filter-btn {
    // width: 190px;
    flex-shrink: 0;
    margin-left: 20px;
    // display: flex;
  }
}
</style>
