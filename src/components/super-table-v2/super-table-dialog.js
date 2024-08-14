import { ref, computed, onMounted } from 'vue'
import http from '@/utils/http.js'
import { ElMessageBox, ElMessage } from 'element-plus'

export function useSuperTableDialog(props, url, emit, form, getDetails) {
  const title = ref('新增')
  const formRef = ref()
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
      .post(url, form)
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
    const { id, ...params } = form
    http
      .put(url + `/${props.itemId}`, params)
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
  return { formLoading, title, formRef, submitForm, cancel, handleClose }
}
