<template>
  <el-menu default-active="/personv2" router class="el-menu-vertical-demo" background-color="transport" text-color="#fff" :collapse="isCollapse">
    <el-menu-item index="/personv2">
      <el-icon><icon-menu /></el-icon>
      <template #title>人员管理</template>
    </el-menu-item>
    <el-menu-item index="/personv1">
      <el-icon><document /></el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import { ref, reactive } from 'vue'
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
const isCollapse = ref(false)
</script>
<style lang="scss"></style>
