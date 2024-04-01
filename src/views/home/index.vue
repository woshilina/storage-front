<template>
  <div class="home">
    <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
    <el-table :data="resultData.tableData" style="width: 100%">
      <el-table-column type="index" width="50" :index="indexMethod" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <div>{{ scope.row.sex == "1" ? "男" : "女" }}</div>
        </template>
      </el-table-column>
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
    <el-pagination
      class="home_pagination"
      background
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
          <el-button @click="cancel(formRef)">Cancel</el-button>
          <el-button type="primary" @click="submitForm(formRef)">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import http from "@/utils/request.js";
import { Plus, Delete, Edit } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";
let dialogVisible = ref(false);
let title = ref("新增");
let resultData = reactive({ tableData: [] });

const currentPage = ref(1);
const pageSize = ref(10);
let total = ref(0);
const indexMethod = (index) => {
  const indexi = index + 1 + (currentPage.value - 1) * pageSize.value;
  return indexi;
};
onMounted(() => {
  getPersonnels(currentPage, pageSize);
});

//获取表格数据方法
const getPersonnels = (currentPage, pageSize) => {
  const params = { currentPage: currentPage.value, pageSize: pageSize.value };
  http.get("/api/v1/personnel/all", { params }).then((res) => {
    resultData.tableData = res.data.data;
    total = res.data.total;
  });
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  getPersonnels(currentPage, pageSize);
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getPersonnels(currentPage, pageSize);
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
const validateID = (rule, value, callback) => {
  let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
  // 校验身份证：
  if (value) {
    if (_IDRe18.test(value) || _IDre15.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确的身份证号码"));
    }
  } else {
    formRef.value.validateField("IDNo", () => null);
    callback();
  }
};
const rules = reactive({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 8, message: "长度 2-8 个", trigger: "blur" },
  ],
  sex: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
  age: [
    { required: true, message: "请输入年龄" },
    { type: "number", message: "年龄应该是数字" },
  ],
  IDNo: [{ validator: validateID, trigger: "blur" }],
});
const resetFormData = () => {
  form.name = "";
  form.sex = "";
  form.age = "";
  form.IDNo = "";
  form.avatar = "";
  form.email = "";
};
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
//点击取消
const cancel = (formEl) => {
  resetForm(formEl); //重置表单
  dialogVisible.value = false;
};
//新增保存
const addSave = (formEl) => {
  http.post("/api/v1/personnel/add", form).then((res) => {
    if (res.data.status == "200") {
      resetForm(formEl); //重置表单
      dialogVisible.value = false;
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      getPersonnels(currentPage, pageSize);
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
      resetForm(formEl); //重置表单
      dialogVisible.value = false;
      ElMessage({
        message: "编辑成功",
        type: "success",
      });
      getPersonnels(currentPage, pageSize);
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
          getPersonnels(currentPage, pageSize);
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
  ElMessageBox.confirm("确定关闭对话框吗?")
    .then(() => {
      formRef.value.resetFields();
      nextTick(() => {
        // formRef.value.resetFields()
        // resetForm(formRef.value); //重置表单 不起作用
        done();
      });
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style lang="scss" scoped>
.home {
  padding: 30px;
  .home_pagination {
    margin: 20px;
    justify-content: right;
  }
}
</style>
