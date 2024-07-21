<template>
  <el-card style="height: 100%">
    <el-input v-model="input1" style="max-width: 600px" placeholder="Please input">
      <template #prepend>Http://</template>
      <template #append></template>
    </el-input>
    <div class="icon-list">
      <span class="icon" v-for="(name, index) in ElIcons" :index="index" :key="index" style="">
        <component :is="name" class="icon-item" size="10"></component>
        <span>{{ name.name }}</span>
      </span>
    </div>
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import * as ElIcons from '@element-plus/icons-vue'
console.log(ElIcons)
const getData = () => {
  let icons = []
  for (const name in ElIcons) {
    icons.push(name)
  }
  return icons
}
const iconList = reactive({
  icons: getData()
})
</script>
<style lang="scss">
.icon-list {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 100%;
  .icon {
    width: 110px;
    height: 90px;
    font-size: 13px;
    margin: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon-item {
      width: 20px;
      height: 20px;
      margin-bottom: 8px;
    }
  }
}
</style>
