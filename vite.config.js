import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig(() => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  return {
    // vite 配置
    // define: {
    //   __APP_ENV__: JSON.stringify(env.APP_ENV),
    // },
    plugins: [
      vue(),
      vueJsx()
      /*
      createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',   
    })*/
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src') //相对路径别名配置，使用@代替src
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8089,
      proxy: {
        '/api': {
          // target: 'http://127.0.0.1:3002',
          target: 'https://storage-service-6evx.onrender.com',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        // 全局样式引入
        scss: {
          // 文件路径，注意最后需要添加 ';'
          additionalData: '@import "@/styles/variable.scss";',
          javascriptEnabled: true
        }
      }
    }
  }
})
