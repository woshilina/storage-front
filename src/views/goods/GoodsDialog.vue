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
import { reactive } from 'vue'
import http from '@/utils/http.js'
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
import { useSuperTableDialog } from '@/components/super-table-v2/super-table-dialog'
const url = '/api/v1/goods'
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const form = reactive({
  name: '',
  specification: '',
  quantity: '',
  weight: '',
  remark: '',
  email: ''
})

// 获取详情
const getDetails = async () => {
  formLoading.value = true
  await http
    .get(`${url}/${props.itemId}`)
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
const { formLoading, title, formRef, submitForm, cancel, handleClose } = useSuperTableDialog(props, url, emit, form, getDetails)

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
    { required: true, message: '请输入重量' }
    // { type: 'number', message: '重量应该是数字' }
  ]
})
</script>
<style lang="scss"></style>
