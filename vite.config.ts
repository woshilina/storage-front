import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    // vite 配置
    // define: {
    //   __APP_ENV__: JSON.stringify(env.APP_ENV),
    // },
    plugins: [
      vue(),
      /*
      createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',   
    })*/
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src"), //相对路径别名配置，使用@代替src
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8089,
      proxy: {
        "/api": {
          target: env.VITE_SERVE,
          changeOrigin: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        // 全局样式引入
        scss: {
          // 文件路径，注意最后需要添加 ';'
          additionalData: '@import "@/styles/variable.scss";',
          javascriptEnabled: true,
        },
      },
    },
  };
});
// export default defineConfig({
//   plugins: [
//     vue(),
//     /*
//     createSvgIconsPlugin({
//     iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
//     symbolId: 'icon-[dir]-[name]',
//   })*/
//   ],
//   resolve: {
//     alias: {
//       "@": path.resolve("./src"), //相对路径别名配置，使用@代替src
//     },
//   },
//   server: {
//     host: "0.0.0.0",
//     port: 8089,
//     // port: viteEnv.VITE_PORT,
//     // open: viteEnv.VITE_OPEN,
//     // cors: true,
//     // Load proxy configuration from .env.development
//     // proxy: import.meta.env.VITE_SERVE
//     proxy: {
//       "/api": {
//         target: "https://mock.presstime.cn/mock/65fa7b8a93195a70234f8b71/",
//         changeOrigin: true,
//       },
//     },
//   },
//   css: {
//     preprocessorOptions: {
//       // 全局样式引入
//       scss: {
//         // 文件路径，注意最后需要添加 ';'
//         additionalData: '@import "@/styles/variable.scss";',
//         javascriptEnabled: true,
//       },
//     },
//   },
// });
