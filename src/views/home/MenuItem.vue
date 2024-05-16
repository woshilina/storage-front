<template>
  <template v-for="menu in menus" :key="menu.id">
    <template v-if="menu.children && menu.children.length > 0">
      <el-sub-menu :index="menu.url">
        <template #title>
          <el-icon><location /></el-icon>
          <span>{{ menu.name }}</span>
        </template>
        <MenuItem :menus="menu.children"></MenuItem>
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item :key="menu.id" :index="menu.url">
        <el-icon><icon-menu /></el-icon>
        <template #title>{{ menu.name }}</template>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup>
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
defineProps(['menus'])
</script>
<style lang="scss"></style>
