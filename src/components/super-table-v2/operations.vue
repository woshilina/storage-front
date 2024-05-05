<template>
  <div class="header-operations">
    <template v-if="operations && operations.length > 0">
      <template v-for="operation in operations">
        <el-button :type="operation.type" :icon="operation.icon" :disabled="operation.disabled" @click="operation.click">{{ operation.text }}</el-button>
      </template>
    </template>
  </div>
</template>
<script setup>
const props = defineProps(['operations'])
</script>
<style lang="scss">
.header-operations {
  flex-shrink: 0;
}
</style>
