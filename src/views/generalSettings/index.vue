<template>
  <el-card class="general-settings" style="height: 100%">
    <h2 class="title">通用设置</h2>
    <el-divider />
    <div class="setting-content">
      <h3 class="page-setting-title">页面设置</h3>
      <p>该设置仅在当前浏览器生效</p>
      <el-radio-group v-model="myColorMode" @change="changeTheme">
        <div class="radio-item">
          <div class="top-icon">
            <el-icon :size="size" :color="myColorMode=='light'?'#409eff':''"><Sunny /></el-icon>
          </div>
          <div class="bottom-radio"><el-radio value="light" size="large">浅色模式</el-radio></div>
        </div>
        <div class="radio-item mlr20">
          <div class="top-icon">
            <el-icon :size="size" :color="myColorMode=='dark'?'#409eff':''"><Moon /></el-icon>
          </div>
          <div class="bottom-radio"><el-radio value="dark" size="large">深色模式</el-radio></div>
        </div>
        <div class="radio-item">
          <div class="top-icon">
            <el-icon :size="size" :color="myColorMode=='default'?'#409eff':''"><Monitor /></el-icon>
          </div>
          <div class="bottom-radio"><el-radio value="default" size="large">跟随系统</el-radio></div>
        </div>
      </el-radio-group>
    </div>
  </el-card>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { Sunny, Moon, Monitor } from '@element-plus/icons-vue'
const size = ref(70)
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
    .el-radio-group{
      width: 100%;
      margin-top: 20px;
    }
    .radio-item {
      width: 30%;
      border-radius: 10px;
      border: 1px solid #ccc;
      padding: 10px;
      .top-icon {
        padding: 10px 0;
        text-align: center;
      }
      .bottom-radio {
        border-top: 1px solid #ccc;
        text-align: center;
      }
    }
    .mlr20 {
      margin: 10px 20px;
    }
  }
}
</style>
