<template>
  <div class="home">
    <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    <el-table :data="resultData.tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="age" label="年龄" width="180" />
      <el-table-column prop="IDNo" label="身份证号码" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="avatar" label="头像" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <Edit style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: #409eff" @click="handleEdit(scope.$index, scope.row)" />
          <Delete
            style="cursor: pointer; width: 1em; height: 1em; margin-right: 8px; color: red"
            @click="handleDelete(scope.$index, scope.row)"
          ></Delete>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="title" width="500" :before-close="handleClose">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="form.age" autocomplete="off" />
        </el-form-item>
        <el-form-item label="身份证号" prop="IDNo">
          <el-input v-model="form.IDNo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="form.avatar" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import http from "@/utils/request.js";
import { Plus, Delete, Edit, Message, Search, Star } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
let dialogVisible = ref(false);
let title = ref("新增");
let resultData = reactive({ tableData: [] });
onMounted(() => {
  getPersonnels();
});
//获取表格数据方法
const getPersonnels = () => {
  http.get("/api/v1/personnel/all").then((res) => {
    resultData.tableData = res.data;
  });
};
const formRef = ref();
const form = reactive({
  name: "",
  sex: "",
  age: "",
  IDNo: "",
  avatar: "",
  email: "",
});
const rules = reactive({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 2, max: 5, message: "Length should be 2 to 5", trigger: "blur" },
  ],
  sex: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
  age: [
    { required: true, message: "age is required" },
    { type: "number", message: "age must be a number" },
  ],
});
//点击新增
const handleAdd = () => {
  title.value = "新增";
  dialogVisible.value = true;
};
//保存
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (title.value == "新增") {
        addSave(formEl);
      } else {
        editSave(formEl);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
//新增保存
const addSave = (formEl) => {
  http.post("/api/v1/personnel/add", form).then((res) => {
    if (res.data.status == "200") {
      resetForm(formEl);//重置表单
      dialogVisible.value = false;
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      getPersonnels();
    } else {
      ElMessage({
        message: "新增失败",
        type: "error",
      });
    }
  });
};
//编辑保存
const editSave = (formEl) => {
  http.patch(`/api/v1/personnel/${form.id}`, form).then((res) => {
    if (res.data.status == "200") {
      resetForm(formEl);//重置表单
      dialogVisible.value = false;
      ElMessage({
        message: "编辑成功",
        type: "success",
      });
      getPersonnels();
    } else {
      ElMessage({
        message: "编辑失败",
        type: "error",
      });
    }
  });
};
//点击行编辑
const handleEdit = (index, row) => {
  Object.assign(form, row);
  title.value = "编辑";
  dialogVisible.value = true;
};
//点击行删除
const handleDelete = (index, row) => {
  ElMessageBox.confirm("确定删除此行数据吗?")
    .then(() => {
      http.delete(`/api/v1/personnel/${row.id}`).then((res) => {
        if (res.data.status == "200") {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          getPersonnels();
        } else {
          ElMessage({
            message: "删除失败",
            type: "error",
          });
        }
      });
      done();
    })
    .catch(() => {
      // catch error
    });
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
const handleClose = (done) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style lang="scss" scoped>
.home {
  padding: 30px;
}
</style>
