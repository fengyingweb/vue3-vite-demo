import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, { VantResolve } from 'vite-plugin-style-import'
const path = require('path')
const glob = require('glob')

function getEntrys() {
  const entrys = {}
  const pages = glob.sync(`${__dirname}/*.html`)
  pages.forEach(pagePath=> {
    let key = path.basename(pagePath, path.extname(pagePath))
    let file = path.basename(pagePath)
    entrys[key] = path.resolve(__dirname, file)
  })
  console.log(entrys)
  return entrys
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  base: './', // 设置打包路径
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    cors: true, // 允许跨域
    proxy: {
      '/api/public': {
        target: 'http://localhost.api.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/api/public': 'public/'
        }
      }
    }
  },
  build: {
    rollupOptions: {
      input: getEntrys(),
      output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
