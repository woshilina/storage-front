<template>
  <el-dialog v-model="dialogVisible" :title="props.title" width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age" placeholder="请输入年龄"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="IDNo">
        <el-input v-model="form.IDNo" placeholder="请输入身份证号"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"/>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="form.avatar" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import http from '@/utils/request.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const dialogVisible = defineModel('dialogVisible')
const props = defineProps(['title', 'formId'])
const emit = defineEmits(['getPersonnels'])
const formRef = ref()
const form = reactive({
  name: '',
  sex: '',
  age: '',
  IDNo: '',
  avatar: '',
  email: ''
})
watch(dialogVisible, async (newValue) => {
  if (newValue && props.title == '编辑') {
    await http.get(`/api/v1/personnel/${props.formId}`).then((res) => {
      Object.assign(form, res.data)
    })
  }
})
const validateID = (rule, value, callback) => {
  let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
  // 校验身份证：
  if (value) {
    if (_IDRe18.test(value) || _IDre15.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的身份证号码'))
    }
  } else {
    callback()
  }
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
//保存
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate((valid, fields) => {
    if (valid) {
      if (props.title == '新增') {
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
  http.post('/api/v1/personnel/add', form).then((res) => {
    if (res.data.status == '200') {
      resetForm(formRef.value) //重置表单
      dialogVisible.value = false
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
  http.patch(`/api/v1/personnel/${form.id}`, form).then((res) => {
    if (res.data.status == '200') {
      resetForm(formRef.value) //重置表单
      dialogVisible.value = false
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
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
//点击取消
const cancel = () => {
  resetForm() //重置表单
  dialogVisible.value = false
}
const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭对话框吗?')
    .then(() => {
      formRef.value.resetFields()
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
<style lang="scss" scoped></style>
