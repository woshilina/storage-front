<template>
  <CustomDialog :title="title" :width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="路由" prop="url">
        <el-input v-model.number="form.url" placeholder="请输入路由" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option label="目录" value="0" />
          <el-option label="菜单" value="1" />
          <el-option label="按钮" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="form.orderNum" :min="1" :max="100" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请选择图标" />
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
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const title = ref('新增')
const formRef = ref()
const form = reactive({
  name: '',
  type: '',
  url: '',
  icon: '',
  orderNum: 1
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
    .get(`/api/v1/menu/${props.itemId}`)
    .then((res) => {
      const { name, url, type, icon, orderNum } = res.data
      form.name = name
      form.url = url
      form.type = type
      form.icon = icon
      form.orderNum = orderNum
    })
    .finally(() => {
      formLoading.value = false
    })
}

const rules = reactive({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 8, message: '长度 2-8 个', trigger: 'blur' }
  ],
  url: [{ required: true, message: '请输入路由', trigger: 'blur' }],
  type: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ],
  orderNum: [
    { required: true, message: '请输入排序', trigger: 'blur' },
    { type: 'number', message: '排序必须是一个数字' }
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
    .post('/api/v1/menu', form)
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
    url: form.url,
    type: form.type,
    icon: form.icon,
    orderNum: form.orderNum
  }
  http
    .put(`/api/v1/menu/${props.itemId}`, params)
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
