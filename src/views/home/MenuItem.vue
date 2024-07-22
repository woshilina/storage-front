<template>
  <template v-for="menu in menus" :key="menu.id">
    <template v-if="menu.children && menu.children.length > 0">
      <el-sub-menu :index="menu.url">
        <template #title>
          <el-icon><svg-icon :name="menu.icon"></svg-icon></el-icon>
          <span>{{ menu.name }}</span>
        </template>
        <MenuItem :menus="menu.children"></MenuItem>
      </el-sub-menu>
    </template>
    <template v-else>
      <el-menu-item :key="menu.id" :index="menu.url" v-permission="menu.code ? menu.code : ''">
        <el-icon><svg-icon :name="menu.icon"></svg-icon></el-icon>
        <template #title>{{ menu.name }}</template>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup>
// import { User, Trophy, Coordinate, Box, Picture, Setting, BellFilled, Document, Menu as IconMenu, Location } from '@element-plus/icons-vue'
defineProps(['menus'])
</script>
<style lang="scss"></style>
