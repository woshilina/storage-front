<template>
  <CustomDialog :title="title" :width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="规格" prop="specification">
        <el-input v-model="form.specification" placeholder="请输入规格" />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model.number="form.quantity" placeholder="请输入数量" />
      </el-form-item>
      <el-form-item label="重量" prop="weight">
        <el-input v-model="form.weight" placeholder="请输入重量" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" />
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
import { validateID } from '@/utils/validate.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const title = ref('新增')
const formRef = ref()
const form = reactive({
  name: '',
  specification: '',
  quantity: '',
  weight: '',
  remark: '',
  email: ''
})
const isEdit = computed(() => {
  return !!props.itemId
})
const formLoading = ref(false)

onMounted(() => {
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
    .get(`/api/v1/goods/${props.itemId}`)
    .then((res) => {
      const { name, specification, quantity, weight, remark } = res.data
      form.name = name
      form.specification = specification
      form.quantity = quantity
      form.weight = weight
      form.remark = remark
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
  specification: [{ required: true, message: '请输入规格' }],
  quantity: [
    { required: true, message: '请输入数量' },
    { type: 'number', message: '数量应该是数字' }
  ],
  weight: [
    { required: true, message: '请输入重量' },
    // { type: 'number', message: '重量应该是数字' }
  ]
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
    .post('/api/v1/goods', form)
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
    name: form.name,
    specification: form.specification,
    quantity: form.quantity,
    weight: form.weight,
    remark: form.remark,
  }
  http
    .put(`/api/v1/goods/${props.itemId}`, params)
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
