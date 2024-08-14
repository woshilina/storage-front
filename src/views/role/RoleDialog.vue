<template>
  <CustomDialog :title="title" :width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="权限" prop="permissionIds">
        <el-tree ref="treeRef" style="max-width: 600px" show-checkbox :data="data" :props="defaultProps" @check="handleCheck" node-key="id" />
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
import { usePermissionStore } from '@/stores/permission'
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
import { useSuperTableDialog } from '@/components/super-table-v2/super-table-dialog'
const url = '/api/v1/roles'

const permissionStore = usePermissionStore()
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const form = reactive({
  name: '',
  remark: '',
  permissionIds: []
})
const defaultProps = {
  children: 'children',
  label: 'name'
}
const data = computed(() => {
  return permissionStore.permissions
})
const treeRef = ref()

const handleCheck = (data, obj) => {
  form.permissionIds = obj.checkedKeys
  formRef.value.validateField('permissionIds')
}

// 获取详情
const getDetails = async () => {
  formLoading.value = true
  await http
    .get(url + `/${props.itemId}`)
    .then((res) => {
      const { name, remark, permissions } = res.data
      form.name = name
      form.remark = remark
      form.permissionIds = permissions.map((item) => item.id)
      treeRef.value.setCheckedKeys(form.permissionIds, false)
    })
    .finally(() => {
      formLoading.value = false
    })
}

const rules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 8, message: '长度 2-8 个', trigger: 'blur' }
  ],
  permissionIds: [{ required: true, message: '请选择菜单权限', trigger: 'change' }]
})
const { formLoading, title, formRef, submitForm, cancel, handleClose } = useSuperTableDialog(props, url, emit, form, getDetails)
</script>
<style lang="scss"></style>
