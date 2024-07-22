# storage-front

[线上体验](https://storage-front-8ecz.onrender.com/)
账号：ceshi 密码：123456

## 项目介绍：
1. 此项目为前端项目，搭配的后端项目是[storage-service](https://github.com/woshilina/storage-service)
2. 此项目使用的是 vue3 框架, UI组件库用的 Element Plus，状态管理 pinia，路由管理 vue-router 4
3. 菜单包含：用户管理、角色管理、权限管理、货物管理
4. 基于Element Plus的 menu 菜单采用递归方式封装左侧菜单
5. 基于Element Plus的Virtualized Table 虚拟化表格封装super-table,利用 vue3 的组合式函数封装相同逻辑，项目中的几个页面除了权限管理都是使用的super-table， super-table 组件可配置批量操作按钮、过滤项、列表项、分页、配置列显隐
6. 为了提高用户体验，使用的 token 和 refresh token，axios 请求拦截和相应拦截封装对应的逻辑
7. 自定义指令 v-permission，用于前端权限判断，控制显隐
8. 利用vite-plugin-svg-icons插件封装图标选择起组件ElIconSelect

## 功能介绍：
1. 用户注册登录
1. 权限管理（增删改查，树形表格结构，编码code唯一）
2. 角色管理（增删改查，配置角色权限）
3. 用户管理（增删改查，配置用户角色）
4. 用户可修改个人信息，修改密码
5. 页面模式可切换设置：浅色模式、深色模式、跟随系统


## 页面展示
1. 登录页
![登录页](/src/assets/screenshot/login.png "登录")
2. 权限管理页
![权限管理页](/src/assets/screenshot/permission.png "权限管理")
3. 角色管理页
![角色管理页](/src/assets/screenshot/role.png "角色管理")
4. 用户管理页
![用户管理页](/src/assets/screenshot/role.png "用户管理")
5. 商品管理页
![商品管理页](/src/assets/screenshot/goods.png "商品管理")
6. 个人信息页
![个人信息页](/src/assets/screenshot/personinfor.png "个人信息页")



