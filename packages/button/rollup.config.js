import { terser } from 'rollup-plugin-terser'
import vue from 'rollup-plugin-vue'

module.exports = [
  {
    input: 'index.js', //入口文件
    output: [
      {
        file: 'dist/index.js', //出口
        format: 'es', //配置打包模块化的方式为 es6  ,也可以改成cjs,commonjs
      },
    ],
    plugins: [
      vue({
        // Dynamically inject css as a <style> tag
        css: true, //把但文件组件的样式插入到html中style标签
        // Explicitly convert template to render function
        compileTemplate: true, //将模版转render函数
      }),
      terser(), //对代码进行压缩
    ],
  },
]
