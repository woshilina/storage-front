<template>
  <el-popover ref="popoverRef" popper-class="columns-popover" placement="bottom-end" :width="250" trigger="click">
    <template #reference>
      <el-button :icon="Setting" circle />
    </template>
    <template #default>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全部</el-checkbox>
      <hr />
      <el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
        <el-checkbox v-for="{ key, title } in columns" :key="key" :label="title" :value="key">
          {{ title ? title : key }}
        </el-checkbox>
      </el-checkbox-group>
      <hr />
      <div class="pop-btns">
        <el-button text @click="handleDefault">恢复默认</el-button>
        <el-button text @click="handleCancel">取消</el-button>
        <el-button type="primary" text @click="handleChecked">确认</el-button>
      </div>
    </template>
  </el-popover>
</template>
<script setup>
import { ref, reactive, computed, toValue } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const localStoreItem = route.name + '-columns'
const emit = defineEmits(['onHandleColumns'])
const popoverRef = ref(null)
const props = defineProps(['columns'])
const checkAll = ref(false)
const isIndeterminate = ref(true)
const initCheckedKeys = computed(() => {
  let checkedKeys = []
  for (const item of props.columns) {
    if (!item.hidden) {
      checkedKeys.push(item.key)
    }
  }
  return checkedKeys
})
const checkedColumns = ref([...toValue(initCheckedKeys)])
const columnsKeys = computed(() => {
  return props.columns.map((item) => item.key)
})
const handleCheckAllChange = (val) => {
  checkedColumns.value = val ? columnsKeys.value : []
  isIndeterminate.value = false
}
const handleCheckedColumnsChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === columnsKeys.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < columnsKeys.value.length
}
const handleDefault = () => {
  localStorage.removeItem(localStoreItem)
  router.go(0)
}
const handleCancel = () => {
  const storedChecked = localStorage.getItem(localStoreItem)
  if (storedChecked) {
    checkedColumns.value = storedChecked.split(',')
  } else {
    checkedColumns.value = toValue(initCheckedKeys)
  }
  popoverRef.value.hide()
}
const handleChecked = () => {
  localStorage.setItem(localStoreItem, checkedColumns.value)
  popoverRef.value.hide()
  emit('onHandleColumns')
}
</script>
<style lang="scss">
.columns-popover {
  .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }
  .pop-btns {
    display: flex;
    justify-content: space-between;
    .el-button {
      padding: 0;
    }
  }
}
</style>
