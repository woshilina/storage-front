<template>
  <!-- <el-card style="height: 100%"> -->
  <el-popover ref="iconPopover" :width="400" trigger="click">
    <template #reference>
      <el-input :modelValue="modelValue" style="max-width: 200px" placeholder="请选择图标">
        <template #prepend>
          <svg-icon color="var(--el-text-color-regular)" :name="modelValue" />
        </template>
      </el-input>
    </template>
    <div class="icon-list">
      <span :class="['icon', { 'icon-active': icon == modelValue }]" v-for="(icon, index) in iconNames" :index="index" :key="index">
        <svg-icon color="var(--el-text-color-regular)" :name="icon" @click="changeIcon(icon)" />
      </span>
    </div>
  </el-popover>
  <!-- </el-card> -->
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    require: false,
    default: ''
  }
})
const emits = defineEmits(['update:modelValue'])
// const modelValue = ref('')
const iconPopover = ref()
const changeIcon = (icon) => {
  emits('update:modelValue', icon)
//   modelValue.value = icon
  iconPopover.value.hide()
}
const iconNames = ref([])
const modules = import.meta.glob('../../assets/icons/*.svg', { eager: true })
for (const path in modules) {
  iconNames.value.push(path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.')))
}
</script>
<style lang="scss">
.icon-list {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 300px;
  .icon {
    // width: 110px;
    // height: 90px;
    font-size: 13px;
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-item {
      width: 30px;
      height: 30px;
      margin-bottom: 8px;
      &:hover {
        color: var(--el-color-primary);
      }
    }

    .icon-active {
      color: var(--el-color-primary);
    }
  }
}
</style>
