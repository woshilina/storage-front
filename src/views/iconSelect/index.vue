<template>
  <div class="">
    <el-icon-select v-model="icon"></el-icon-select>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const icon = ref('alert')
</script>
<style lang="scss"></style>
