<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_left hidden-md-and-down">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div>
      <div class="login_right">
        <div class="login-logo">
          <!-- <img class="login-icon" src="@/assets/images/logo.svg" alt="" /> -->
          <h2 class="logo-text">Welcome</h2>
        </div>
        <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" status-icon :rules="rules" size="large" class="demo-ruleForm">
          <el-form-item prop="account">
            <el-input v-model="ruleForm.account" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="密码" show-password :prefix-icon="Lock" autocomplete="off" />
          </el-form-item>
          <el-form-item class="login-btns">
            <el-button type="primary" @click="submitForm(ruleFormRef)" round :icon="UserFilled">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/user'
import { ref, reactive } from 'vue'
import { User, Lock, UserFilled } from '@element-plus/icons-vue'
const userStore = useUserStore()
const ruleFormRef = ref()
const ruleForm = reactive({
  account: '',
  password: ''
})
const rules = reactive({
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
})
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const loginData = {
        account: ruleForm.account,
        password: ruleForm.password
      }
      userStore.setUserInfo(loginData)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100%;
  padding: 20px;
  min-height: 550px;
  background-color: #eee;
  background-image: url('@/assets/images/login_bg.svg');
  background-size: cover;
  .login_box {
    height: 100%;
    padding: 0 30px;
    background-color: #fffc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .login_left {
      width: 800px;
      .login-left-img {
        width: 100%;
      }
    }
    .login_right {
      width: 520px;
      padding: 50px 40px 45px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.2);
      .login-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 45px;
        .login-icon {
          width: 60px;
          height: 52px;
        }
        .logo-text {
          color: #000;
          padding-left: 25px;
          font-size: 42px;
          font-weight: 700;
          white-space: nowrap;
        }
      }
      .demo-ruleForm {
        :deep(.el-form-item__content) {
          display: flex;
          align-items: center;
          justify-content: center;
          .el-button {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
