<template>
  <div class="home">
    <div class="userinfo">{{ userStore.userInfo.username }}<el-button class="quitBtn" type="primary" text @click="goOut">退出</el-button></div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const goOut = () => {
  userStore.clearUserInfo()
  // 跳转到登录页面
  router.push('/login')
}
</script>
<style lang="scss">
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .userinfo {
    padding: 10px 20px 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    .quitBtn{
      margin-left: 15px;
    }
  }
}
</style>
