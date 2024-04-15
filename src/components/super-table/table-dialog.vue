<template>
  <el-dialog :model-value="true" :title="title" width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <template v-for="column in columns" :key="column.prop">
        <el-form-item :label="column.label" :prop="column.prop">
          <slot :name="column.prop + '-form'">
            <el-input v-if="column.type == 'input'" v-model="form[column.prop]" :placeholder="column.label" clearable />
            <el-select v-else-if="column.type == 'select'" v-model="form[column.prop]" :placeholder="column.label" clearable>
              <el-option v-for="dic in column.dicData" :key="dic.label" :label="dic.label" :value="dic.value" />
            </el-select>
          </slot>
        </el-form-item>
      </template>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
const { columns } = defineProps(['columns'])
const emit = defineEmits(['rowSave', 'rowEdit', 'closeDialog'])
const title = ref('新增')
const formRef = ref()
const form = defineModel()
const rules = computed(() => {
  const rules = {}
  columns.forEach((col) => {
    if (col.rules && col.rules.length > 0) {
      rules[col.prop] = col.rules
    }
  })
  return rules
})
const isEdit = computed(() => {
  return !!form.value.id
})
const formLoading = ref(false)
onMounted(() => {
  if (form.value.id) {
    title.value = '编辑'
  } else {
    title.value = '新增'
  }
})
// 提交
const submitForm = () => {
  if (!formRef.value) return
  formRef.value.validate((valid, fields) => {
    if (valid) {
      if (!isEdit.value) {
        emit('rowSave')
      } else {
        emit('rowEdit')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
//点击取消
const cancel = () => {
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
