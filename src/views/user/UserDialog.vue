<template>
  <CustomDialog :title="title" :width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" disabled placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
          <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submitForm()" :loading="formLoading">确定</el-button>
      </div>
    </template>
  </CustomDialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import http from '@/utils/http.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { validatePassword, validateEmail } from '@/utils/validate'
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
const roles = ref([])
const getRoles = () => {
  http.get('/api/v1/roles/all').then((res) => {
    roles.value = res.data
  })
}
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const title = ref('新增')
const formRef = ref()
const form = reactive({
  account: '',
  password: '123456',
  name: '',
  email: '',
  roleIds: []
})

const isEdit = computed(() => {
  return !!props.itemId
})
const formLoading = ref(false)
onMounted(() => {
  getRoles()
  if (props.itemId) {
    title.value = '编辑'
    getDetails()
  } else {
    title.value = '新增'
  }
})

// 获取详情
const getDetails = async () => {
  formLoading.value = true
  await http
    .get(`/api/v1/users/${props.itemId}`)
    .then((res) => {
      const { account, name, email, roles } = res.data
      form.account = account
      // form.password = password
      form.name = name
      form.email = email
      form.roleIds = roles.map((role) => role.id)
    })
    .finally(() => {
      formLoading.value = false
    })
}

const rules = reactive({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 2, max: 16, message: '长度 2-16 个', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
    // { validator: validatePassword, trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 8, message: '长度 2-8 个', trigger: 'blur' }
  ],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }]
})

// 提交
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate((valid, fields) => {
    if (valid) {
      if (!isEdit.value) {
        addSave()
      } else {
        editSave()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

//新增保存
const addSave = () => {
  formLoading.value = true
  http
    .post('/api/v1/users', form)
    .then(() => {
      emit('closeDialog')
      ElMessage({
        message: '新增成功',
        type: 'success'
      })
      emit('queryTableData')
    })
    .finally(() => {
      formLoading.value = false
    })
}

// 编辑保存
const editSave = () => {
  formLoading.value = true
  const params = {
    account: form.account,
    password: form.password,
    name: form.name,
    email: form.email,
    roleIds: form.roleIds
  }
  http
    .put(`/api/v1/users/${props.itemId}`, params)
    .then(() => {
      emit('closeDialog')
      ElMessage({
        message: '编辑成功',
        type: 'success'
      })
      emit('queryTableData')
    })
    .finally(() => {
      formLoading.value = false
    })
}
// 点击取消
const cancel = () => {
  emit('closeDialog')
}
const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭对话框吗?').then(() => {
    formRef.value.resetFields()
    formLoading.value = false
    emit('closeDialog')
    done()
  })
}
</script>
<style lang="scss"></style>
