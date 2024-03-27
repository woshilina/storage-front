<script setup lang="ts">
console.log(import.meta.env);
import { onMounted } from "vue";
import axios from "@/utils/request.ts";
onMounted(() => {
  axios({
    method: "get",
    url: "/username",
  }).then(function (response) {
    console.log(response.data);
  });
});
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped lang="scss"></style>
