<template>
  <div class="user-infor">
    <div>
      <div class="infor-title">基本信息</div>
      <el-form ref="formRef" class="inforform" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" disabled placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" :loading="formLoading" @click="onSubmitInfor">提交</el-button>
        </el-form-item>
      </el-form>
      <div class="infor-title">修改密码</div>
      <el-form ref="passwordFormRef" class="inforform" :model="passwordForm" :rules="passwordRules" label-width="auto" v-loading="passFormLoading" element-loading-background="rgba(255,255,255,0.6)">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新的密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" placeholder="请输入新的密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" placeholder="请输入确认密码" />
        </el-form-item>
        <el-form-item class="btn">
          <el-button type="primary" :loading="passFormLoading" @click="onSubmitPassword">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/utils/http.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { validatePassword, validateEmail } from '@/utils/validate'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const userId = userStore.userInfo.id
const formRef = ref()
const passwordFormRef = ref()
const formLoading = ref(false)
const passFormLoading = ref(false)
const form = reactive({
  account: '',
  name: '',
  email: ''
})
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
onMounted(() => {
  getDetails()
})
// 获取详情
const getDetails = async () => {
  formLoading.value = true
  await http
    .get(`/api/v1/users/${userId}`)
    .then((res) => {
      const { account, name, email } = res.data
      form.account = account
      form.name = name
      form.email = email
    })
    .finally(() => {
      formLoading.value = false
    })
}

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 8, message: '长度 2-8 个', trigger: 'blur' }
  ],
  email: [{ validator: validateEmail, trigger: 'blur' }]
})

const validatePass = (rule, value, callback) => {
  console.log(value)
  if (value === '') {
    callback(new Error('请输入新的密码'))
  } else {
    const passwordRE = /^[\da-zA-Z]{6,12}$/
    if (passwordRE.test(value)) {
      if (!passwordFormRef.value) return
      passwordFormRef.value.validateField('confirmPassword')
    } else {
      callback(new Error('由字母或数字组成，6-12位'))
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = reactive({
  oldPassword: [{ validator: validatePassword, trigger: 'blur' }],
  newPassword: [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
})

const onSubmitInfor = () => {
  if (!formRef.value) return
  formLoading.value = true
  formRef.value.validate((valid, fields) => {
    if (valid) {
      http
        .put(`/api/v1/users/${userId}`, form)
        .then(() => {
          ElMessage({
            message: '编辑成功',
            type: 'success'
          })
        })
        .finally(() => {
          formLoading.value = false
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const onSubmitPassword = () => {
  if (!passwordFormRef.value) return
  passFormLoading.valuue = true
  passwordFormRef.value.validate((valid, fields) => {
    if (valid) {
      http.patch(`/api/v1/users/${userId}`, passwordForm).then((res) => {
        if (res.data.type == 'error') {
          ElMessage({
            message: res.data.message,
            type: 'error'
          })
        } else {
          ElMessage({
            message: '修改成功，请重新登录',
            type: 'success'
          })
          userStore.clearUserInfo()
          router.push('/login')
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>
<style lang="scss">
.user-infor {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .infor-title {
    border-left: 2px solid blue;
    padding-left: 10px;
    margin: 30px 0;
    &:last-of-type {
      margin-top: 90px;
    }
  }
  .inforform {
    width: 400px;
    .btn {
      .el-form-item__content {
        flex-direction: row-reverse;
      }
    }
  }
}
</style>
