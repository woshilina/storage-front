<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="title">admin管理系统</div>
        <el-menu :default-active="$route.path" router class="el-menu-vertical-demo" background-color="transport" text-color="#fff" :collapse="isCollapse">
          <MenuItem :menus="menuTree"></MenuItem>
          <!-- <MenuItem></MenuItem> -->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="userinfo">
            <el-button
              link
              @click="
                () => {
                  router.push('/user-infor')
                }
              "
              >{{ username }}</el-button
            >
            <el-switch
              class="theme-switch"
              v-model="isDark"
              inline-prompt
              :active-icon="Moon"
              :inactive-icon="Sunny"
              active-color="var(--el-fill-color-dark)"
              inactive-color="var(--el-color-primary)"
              @change="toggleDark"
            />

            <el-button class="quitBtn" type="primary" text @click="goOut">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import MenuItem from './MenuItem.vue'
import { menuTree } from '@/utils/menus.js'
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const userStore = useUserStore()
const username = userStore.userInfo.user ? userStore.userInfo.user.name : ''
const router = useRouter()
const isCollapse = ref(false)

const goOut = () => {
  userStore.clearUserInfo()
  // 跳转到登录页面
  router.push('/login')
}
</script>
<style lang="scss">
.home {
  height: 100%;

  .el-container {
    height: 100%;

    .el-card__body {
      height: 100%;
    }
  }
  .el-header {
    background-color: #fff;
    color: #606266;
    border-bottom: 1px solid var(--el-border-color-light);
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.09);
  }
  .el-aside {
    background-color: #304156;
    color: #fff;
    border-right: 1px solid transparent;
    overflow: hidden;
    .title {
      text-align: center;
      height: 59px;
      line-height: 59px;
      border-bottom: 1px solid #606266;
    }
    .el-menu {
      border-right: 0;
      height: calc(100% - 50px);
      overflow: scroll;
    }
  }
  .userinfo {
    padding: 10px 20px 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    .el-select__suffix {
      display: none;
    }
    .theme-switch {
      margin-left: 18px;
      margin-right: 6px;
    }
  }
}
</style>
