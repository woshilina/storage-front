<template>
  <SuperTable :option="option" :data="data" v-model:search="search" v-model:page="page" @on-load="onLoad"></SuperTable>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/utils/request.js'

const search = reactive({})
const checkAge = (rule, value, callback) => {
  if (!String(search.fromAge) || !search.toAge) {
    return callback(new Error('请完整输入年龄范围'))
  } else if (!Number.isInteger(search.fromAge) || !Number.isInteger(search.toAge)) {
    return callback(new Error('请输入整数'))
  } else if (search.fromAge > search.toAge) {
    return callback(new Error('起始年龄应不大于终止年龄'))
  } else {
    callback()
  }
}
const page = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10
})
const data = ref([])
const option = reactive({
  index: true,
  menu: true,
  selection: true,
  columns: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input',
      rules: [
        {
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }
      ],
      search: true,
      searchRules: [
        {
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }
      ]
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      rules: [
        {
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }
      ],
      search: true,
      dicData: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ]
    },
    {
      label: '年龄',
      prop: 'age',
      type: 'input',
      rules: [
        {
          required: true,
          message: '请输入年龄',
          trigger: 'blur'
        }
      ],
      search: true,
      searchRules: [{ validator: checkAge, trigger: 'blur' }]
    }
    // {
    //   label: '年龄',
    //   prop: 'age',
    //   type: 'input',
    //   search: true
    // }
  ]
})
function onLoad() {
  const queryParams = {}
  Object.keys(search).forEach((key) => {
    if (search[key] !== '') {
      queryParams[key] = search[key]
    }
  })
  const params = { currentPage: page.currentPage, pageSize: page.pageSize, ...queryParams }
  http
    .get('/api/v1/personnel/all', { params })
    .then((res) => {
      data.value = res.data.data
      page.total = res.data.total
    })
    .catch(() => {})
}
onMounted(() => {
  onLoad()
})
</script>
<style lang="scss"></style>
