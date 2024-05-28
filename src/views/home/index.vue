<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
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
            <el-button class="quitBtn" type="primary" text @click="goOut">退出</el-button>
          </div>
        </el-header>
        <el-main> <router-view></router-view> </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import MenuItem from './MenuItem.vue'
import { menuTree } from '@/utils/menus.js'
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
  }
  .el-header {
    background-color: #fff;
    color: #606266;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.09);
  }
  .el-aside {
    background: rgb(25, 26, 35);
    color: #fff;
  }
  .userinfo {
    padding: 10px 20px 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    .quitBtn {
      margin-left: 15px;
    }
  }
}
</style>
