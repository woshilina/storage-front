<template>
  <CustomDialog :title="title" :width="500" :before-close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" v-loading="formLoading" element-loading-background="rgba(255,255,255,0.6)">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="上级权限" prop="parentId">
        <el-tree-select v-model="form.parentId" :data="treeData" check-strictly :render-after-expand="false" />
      </el-form-item>
      <el-form-item label="路由" prop="url">
        <el-input v-model="form.url" placeholder="请输入路由" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入编码" />
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
import { useMenuStore } from '@/stores/permission'
import { ElMessageBox, ElMessage } from 'element-plus'
import CustomDialog from '@/components/custom-dialog/custom-dialog.vue'
import { useSuperTableDialog } from '@/components/super-table-v2/super-table-dialog'
const url = '/api/v1/permissions'

const menuStore = useMenuStore()
const customTreeData = (arr) =>
  arr.map((item) => ({
    ...item,
    label: item.name,
    value: item.id,
    children: item.children ? customTreeData(item.children) : []
  }))
const treeData = customTreeData(menuStore.menus)
const props = defineProps(['itemId'])
const emit = defineEmits(['queryTableData', 'closeDialog'])
const form = reactive({
  name: '',
  parentId: null,
  type: '',
  url: '',
  code: '',
  icon: '',
  orderNum: 1
})

// 获取详情
const getDetails = async () => {
  formLoading.value = true
  await http
    .get(`/api/v1/permissions/${props.itemId}`)
    .then((res) => {
      const { parentId, name, url, code, type, icon, orderNum } = res.data
      form.parentId = parentId
      form.name = name
      form.url = url
      form.code = code
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
  url: [{ required: false, message: '请输入路由', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
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
const { formLoading, title, formRef, submitForm, cancel, handleClose } = useSuperTableDialog(props, url, emit, form, getDetails)
</script>
<style lang="scss"></style>
