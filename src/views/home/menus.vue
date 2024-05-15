<template>
  <el-menu :default-active="$route.path" router class="el-menu-vertical-demo" background-color="transport" text-color="#fff" :collapse="isCollapse">
    <el-menu-item  v-for="menu in menuStore.menus" :key='menu.id' :index="menu.url">
      <el-icon><icon-menu /></el-icon>
      <template #title>{{menu.name}}</template>
    </el-menu-item>
  </el-menu>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/menu'
const isCollapse = ref(false)
const menuStore = useMenuStore()
onMounted(() => {
  menuStore.setMenus()
})
</script>
<style lang="scss"></style>
