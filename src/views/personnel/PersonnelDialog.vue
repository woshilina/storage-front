<template>
  <el-dialog :model-value="true" :title="title" width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age" placeholder="请输入年龄" />
      </el-form-item>
      <el-form-item label="身份证号" prop="IDNo">
        <el-input v-model="form.IDNo" placeholder="请输入身份证号" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="form.avatar" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submitForm()" :loading="formLoading">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import http from '@/utils/http.js'
import { validateID } from '@/utils/validate.js'
import { ElMessageBox, ElMessage } from 'element-plus'
const props = defineProps(['formId'])
const emit = defineEmits(['getPersonnels', 'closeDialog'])
const title = ref('新增')
const formRef = ref()
const form = reactive({
  name: '',
  sex: '',
  age: '',
  IDNo: '',
  avatar: '',
  email: ''
})
const isEdit = computed(() => {
  return !!props.formId
})
const formLoading = ref(false)

onMounted(() => {
  if (props.formId) {
    title.value = '编辑'
    getFormItems()
  } else {
    title.value = '新增'
  }
})

// 获取form详情
const getFormItems = async () => {
  // formLoading.value = true
  await http.get(`/api/v1/personnel/${props.formId}`).then((res) => {
    const { name, sex, age, IDNo, avatar, email } = res.data
    formLoading.value = false
    form.name = name
    form.sex = sex
    form.age = age
    form.IDNo = IDNo
    form.avatar = avatar
    form.email = email
  })
}

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 8, message: '长度 2-8 个', trigger: 'blur' }
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ],
  age: [
    { required: true, message: '请输入年龄' },
    { type: 'number', message: '年龄应该是数字' }
  ],
  IDNo: [{ validator: validateID, trigger: 'blur' }]
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
  // formLoading.value = true
  http.post('/api/v1/personnel/add', form).then((res) => {
    formLoading.value = false
    if (res.data.status == '200') {
      // resetForm(formRef.value) //重置表单
      emit('closeDialog')
      ElMessage({
        message: '新增成功',
        type: 'success'
      })
      emit('getPersonnels')
    } else {
      ElMessage({
        message: '新增失败',
        type: 'error'
      })
    }
  })
}

// 编辑保存
const editSave = () => {
  // formLoading.value = true
  const editData = {
    name: form.name,
    age: form.age,
    sex: form.sex,
    IDNo: form.IDNo,
    avatar: form.avatar,
    email: form.email
  }
  http.put(`/api/v1/personnel/${props.formId}`, editData).then((res) => {
    formLoading.value = false
    if (res.data.status == '200') {
      // resetForm(formRef.value) //重置表单
      emit('closeDialog')
      ElMessage({
        message: '编辑成功',
        type: 'success'
      })
      emit('getPersonnels')
    } else {
      ElMessage({
        message: '编辑失败',
        type: 'error'
      })
    }
  })
}
// const resetForm = () => {
//   if (!formRef.value) return
//   formRef.value.resetFields()
// }
//点击取消
const cancel = () => {
  // resetForm() //重置表单
  emit('closeDialog')
}
const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭对话框吗?')
    .then(() => {
      formRef.value.resetFields()
      formLoading.value = false
      emit('closeDialog')
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
<style lang="scss"></style>
