<template>
  <el-dialog class="custom-dialog" :model-value="true" :title="title" :width="width" :before-close="handleClose">
    <template #default><slot></slot></template>
    <template #footer><slot name="footer"></slot></template>
  </el-dialog>
</template>
<script setup>
defineProps(['title', 'width'])
const emit = defineEmits(['handleClose'])
const handleClose = () => {
  emit('handleClose')
}
</script>
<style lang="scss">
.custom-dialog {
  padding: 0;
  border-radius: 8px;
  .el-dialog__header {
    padding: 12px 16px;
    background-color: var(--el-color-primary);
    border-radius: 6px 6px 0 0;
    .el-dialog__title {
      color: var(--el-color-white);
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        color: var(--el-color-white);
      }
    }
  }
  .el-dialog__body {
    padding: 16px;
  }
  .el-dialog__footer {
    padding: 16px;
  }
}
</style>
