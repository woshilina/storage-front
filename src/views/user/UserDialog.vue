<template>
  <CustomDialog :title="title" :width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="初始密码" prop="password">
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
import { ref, reactive, onMounted } from 'vue'
import http from '@/utils/http.js'
import { validateEmail } from '@/utils/validate'
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
import { useSuperTableDialog } from '@/components/super-table-v2/super-table-dialog'
const url = '/api/v1/users'

const roles = ref([])
const getRoles = () => {
  http.get('/api/v1/roles/all').then((res) => {
    roles.value = res.data
  })
}
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const form = reactive({
  account: '',
  password: '123456',
  name: '',
  email: '',
  roleIds: []
})

onMounted(() => {
  getRoles()
})

// 获取详情
const getDetails = async () => {
  formLoading.value = true
  await http
    .get(url + `/${props.itemId}`)
    .then((res) => {
      const { account, name, email, roles } = res.data
      form.account = account
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
const { formLoading, title, formRef, submitForm, cancel, handleClose } = useSuperTableDialog(props, url, emit, form, getDetails)
</script>
<style lang="scss"></style>
