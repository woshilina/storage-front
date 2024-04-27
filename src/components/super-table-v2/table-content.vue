<template>
  <div class="table-content" style="height: 600px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2 :columns="columns" :data="data" :width="width" :height="height" />
      </template>
    </el-auto-resizer>
  </div>
</template>
<script  setup>
defineProps(['data', 'columns'])
</script>
<style lang="scss"></style>
