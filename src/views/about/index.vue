<template>
  <div class="about">
    <el-card class="card mb10">
      <h2 class="title">简介</h2>
      <div class="text">admin管理系统 是基于 Vue3 + Vite5 + Element-Plus + Pinia + NestJS + TypeORM等最新主流技术栈构建的后台管理系统前端模板。</div>
    </el-card>
    <el-card class="card mb10">
      <el-descriptions title="项目信息" border :column="2">
        <el-descriptions-item label="版本号"> <el-tag size="small" class="custom-tag" color="#fff">1.0.0</el-tag></el-descriptions-item>
        <el-descriptions-item label="发布时间"><el-tag size="small" class="custom-tag" color="#fff">2024-07-05 09:46</el-tag></el-descriptions-item>
        <el-descriptions-item label="前端Github">
          <el-link href="https://github.com/woshilina/storage-front" type="primary" target="_blank">前端项目</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="后台Github">
          <el-link href="https://github.com/woshilina/storage-service" type="primary" target="_blank">后台项目</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="在线预览">
          <el-link href="https://storage-front-8ecz.onrender.com" type="primary" target="_blank">在线预览</el-link>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="card mb10">
      <h2 class="title">功能简介</h2>
      <ol class="funcList">
        <li>基于<el-text type="success">Element Plus</el-text>的 <el-text type="success">menu </el-text>菜单采用递归方式封装左侧菜单</li>
        <li>
          基于<el-text type="success">Element Plus</el-text>的<el-text type="success">Virtualized Table</el-text> 虚拟化表格封装<el-text type="success">super-table</el-text>,根据可复用性利用 vue3
          的组合式函数封装相同逻辑，项目中的几个页面除了权限管理都是使用的<el-text type="success">super-table</el-text>组件， <el-text type="success">super-table</el-text>
          组件可配置批量操作按钮，过滤项，列表项，分页
        </li>
        <li>
          为了提高用户体验，使用 <el-text type="success">token</el-text> 和 <el-text type="success">refresh token</el-text>实现无感刷新，<el-text type="success">axios</el-text>
          请求拦截和相应拦截封装对应的逻辑
        </li>
        <li>基于<el-text type="success">RBAC</el-text>模式实现权限管理功能，先配置权限，其中权限的 code 编码唯一用于权限验证，再给角色分配权限，最后给用户分配角色，用户即可享有对应的权限</li>
        <li>自定义指令<el-text type="success">v-permission</el-text>, 用于前端权限判断，控制显隐</li>
        <li>用户点击用户姓名进入个人信息页面，可修改个人信息，修改密码</li>
        <li>后端接口采用<el-text type="success">RESTful API </el-text> 风格，构建易于理解、易于使用、易于维护的Web服务</li>
        <li>基于<el-text type="success">jwt</el-text>身份验证，将身份验证保护注册为全局守卫，自定义的<el-text type="success">@Public()</el-text>装饰器，将路由声明为公共的机制</li>
        <li>自定义权限守卫 <el-text type="success"></el-text>，结合权限装饰器<el-text type="success">@RequirePermission([code])</el-text>判断用户是否有访问接口权限</li>
        <li>使用<el-text type="success">bcryptjs</el-text>用于用户密码加密，提高安全性</li>
      </ol>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
</script>
<style lang="scss">
.about {
  .card {
    padding: 0px 5px;
    .custom-tag {
      color: black;
    }
    .funcList {
      font-size: 14px;
      line-height: 25px;
      padding-left: 20px;
      li {
        margin-bottom: 10px;
      }
    }
  }
  .mb10 {
    margin-bottom: 10px;
  }
  .title {
    margin-bottom: 15px;
    font-size: 17px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }
  .text {
    font-size: 15px;
    line-height: 25px;
    color: var(--el-text-color-regular);
  }
}
</style>
