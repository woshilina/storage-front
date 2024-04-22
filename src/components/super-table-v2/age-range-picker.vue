<template>
  <div class="age-range-picker" :value="agerange">
    <el-input v-model.number="agerange[0]" placeholder="起始年龄" clearable />
    <div class="inputrange_line">-</div>
    <el-input v-model.number="agerange[1]" placeholder="终止年龄" clearable />
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'

</script>
<style lang="scss">
.age-range-picker {
  display: inline-flex;
  flex-grow: 1;
  .inputrange_line {
    margin: 0 8px;
  }
}
</style>
