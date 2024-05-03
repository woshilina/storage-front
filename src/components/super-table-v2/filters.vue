<template>
  <el-form class="filter-form-v2" ref="queryRef" :model="filterForm" :rules="searchRules">
    <template v-for="filter in filters" :key="filter.prop">
      <div :style="{ width: filter.width + 'px' }">
        <el-form-item :label="filter.label" :prop="filter.prop">
          <el-input v-if="filter.type == 'input'" :model-value="filter.value" @input.native="(value) => filterValueChange(value, filter.prop)" :placeholder="filter.label" clearable />
          <el-select v-else-if="filter.type == 'select'" :model-value="filter.value" @change="(value) => filterValueChange(value, filter.prop)" :placeholder="filter.label" clearable>
            <el-option v-for="dic in filter.dicData" :key="dic.value" :label="dic.label" :value="dic.value" />
          </el-select>
          <el-radio-group v-else-if="filter.type == 'radio'" :model-value="filter.value" @change="(value) => filterValueChange(value, filter.prop)">
            <el-radio v-for="dic in filter.dicData" :key="dic.value" :value="dic.value">{{ dic.label }}</el-radio>
          </el-radio-group>
          <div v-else-if="filter.type == 'agerange'" class="age-range-picker">
            <el-input-number
              :model-value="filter.value[0]"
              @input.native="(value) => filterValueChange([value, filter.value[1]], filter.prop)"
              :min="0"
              :max="100"
              :controls="false"
              placeholder="最小年龄"
            />
            <div class="inputrange_line">-</div>
            <el-input-number
              :model-value="filter.value[1]"
              @input.native="(value) => filterValueChange([filter.value[0], value], filter.prop)"
              :min="1"
              :max="100"
              :controls="false"
              placeholder="最大年龄"
            />
          </div>
          <el-date-picker v-else-if="filter.type == 'date'" :model-value="filter.value" @update:modelValue="(value) => filterValueChange(value, filter.prop)" type="date" placeholder="Pick a day" />
          <el-date-picker
            v-else-if="filter.type == 'daterange'"
            :model-value="filter.value"
            @update:modelValue="(value) => filterValueChange(value, filter.prop)"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="filter.shortcuts"
          />
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
import { ref, reactive, computed } from 'vue'
const queryRef = ref()
const props = defineProps(['filters'])
const emit = defineEmits(['handleFilter', 'filterValueChange'])
const initForm = reactive({})
const filterForm = computed(() => {
  props.filters.forEach((col) => {
    initForm[col.prop] = col.value
  })
  return initForm
})
const searchRules = computed(() => {
  const rules = {}
  props.filters.forEach((col) => {
    if (col.rules && col.rules.length > 0) {
      rules[col.prop] = col.rules
    }
  })
  return rules
})
const filterValueChange = (value, columnProp) => {
  emit('filterValueChange', value, columnProp)
}
const onQuery = () => {
  if (!queryRef.value) return
  queryRef.value.validate((valid, fields) => {
    if (valid) {
      emit('handleFilter')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const onEmpty = () => {
  props.filters.forEach((item) => {
    emit('filterValueChange', '', item.prop)
  })
  emit('handleFilter')
}
</script>
<style lang="scss">
.filter-form-v2 {
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
    .age-range-picker {
      display: inline-flex;
      flex-grow: 1;
      background-color: var(--el-bg-color);
      box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
      border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
      .el-input-number {
        width: 100%;
        .el-input__wrapper {
          padding: 0 5px;
          background-color: transparent;
          border: none;
          box-shadow: none;
        }
      }
      .inputrange_line {
        margin: 0 8px;
      }
    }
  }
  .filter-btn {
    flex-shrink: 0;
    margin-left: 20px;
  }
}
</style>
