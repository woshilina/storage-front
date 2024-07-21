<template>
  <el-card class="general-settings" style="height: 100%">
    <h2 class="title">通用设置</h2>
    <el-divider />
    <div class="setting-content">
      <h3 class="page-setting-title">页面设置</h3>
      <p>该设置仅在当前浏览器生效</p>
      <div>
        <el-radio-group v-model="myColorMode" @change="changeTheme">
          <el-radio value="light" size="large">浅色模式</el-radio>
          <el-radio value="dark" size="large">深色模式</el-radio>
          <el-radio value="default" size="large">跟随系统</el-radio>
        </el-radio-group>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useColorMode } from '@vueuse/core'

const { system, store } = useColorMode()
// system.value 记录的当前电脑系统使用的是深色还是浅色
// 'dark' | 'light'
// store.value 记录的是项目页面设置是 深色、浅色、根据系统
// 'dark' | 'light' | 'auto'

// 计算属性，动态获取设置的 主题色模式
const myColorMode = computed(() => (store.value === 'auto' ? system.value : store.value))
const changeTheme = (val) => {
  store.value = val
}
</script>
<style lang="scss">
.general-settings {
  .title {
    font-size: 20px;
  }
  .setting-content {
    .page-setting-title {
      font-size: 18px;
      margin-bottom: 15px;
    }
  }
}
</style>
