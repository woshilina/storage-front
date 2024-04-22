<template>
  <el-form class="search-form-v2" ref="queryRef" :model="filters.search" :rules="searchRules">
    <template v-for="filter in filters.items" :key="filter.prop">
      <div :style="{ width: filter.width + 'px' }">
        <el-form-item :label="filter.label" :prop="filter.prop">
          <slot name="filter" v-bind="filter">
            <el-input v-if="filter.type == 'input'" :model-value="filters.search[filter.prop]" @input.native="(value) => searchChange(value, filter.prop)" :placeholder="filter.label" clearable />
            <el-select v-else-if="filter.type == 'select'" :model-value="filters.search[filter.prop]" @change="(value) => searchChange(value, filter.prop)" :placeholder="filter.label" clearable>
              <el-option v-for="dic in filter.dicData" :key="dic.value" :label="dic.label" :value="dic.value" />
            </el-select>
            <el-radio-group v-else-if="filter.type == 'radio'" :model-value="filters.search[filter.prop]" @change="(value) => searchChange(value, filter.prop)">
              <el-radio v-for="dic in filter.dicData" :key="dic.value" :value="dic.value">{{ dic.label }}</el-radio>
            </el-radio-group>
            <el-date-picker v-else-if="filter.type == 'date'" v-model="filters.search[filter.prop]" type="date" placeholder="Pick a day" />
            <el-date-picker
              v-else-if="filter.type == 'daterange'"
              v-model="filters.search[filter.prop]"
              type="daterange"
              unlink-panels
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
              :shortcuts="filter.shortcuts"
            />
            <!-- :model-value="search[filter.prop]" -->
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
const props = defineProps(['filters'])
const searchRules = computed(() => {
  const rules = {}
  props.filters.items.forEach((col) => {
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
    .el-radio {
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .filter-btn {
    // width: 190px;
    flex-shrink: 0;
    margin-left: 20px;
    // display: flex;
  }
}
</style>
