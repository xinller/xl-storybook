## 安装测试依赖

```bash
yarn add jest @vue/test-utils vue-jest babel-jest -D -W
```

## Jest 的配置

jest.config.js

```js
module.exports = {
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  moduleFileExtensions: [
    'js',
    'json',
    // 告诉 Jest 处理 `*.vue` 文件
    'vue',
  ],
  transform: {
    // 用 `vue-jest` 处理 `*.vue` 文件
    '.*\\.(vue)$': 'vue-jest',
    // 用 `babel-jest` 处理 js
    '.*\\.(js)$': 'babel-jest',
  },
}
```

## Babel 的配置

babel.config.js

```js
module.exports = {
  presets: [['@babel/preset-env']],
}
```

## Babel 的桥接

```bash
yarn add babel-core@bridge -D -W
```

## 安装 Rollup 以及所需的插件

```bash
yarn add rollup rollup-plugin-terser rollup-plugin-vue@5.1.9 vue-template-compiler -D -W
```

## Rollup 配置文件

在 button 目录中创建 rollup.config.js

```js
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
```

## 配置 build 脚本并运行

找到 button 包中的 package.json 的 scripts 配置

```js
"build": "rollup -c"
```

运行打包

```bash
yarn workspace lg-button run build
```

## 打包所有组件

### 安装依赖

```bash
yarn add @rollup/plugin-json rollup-plugin-postcss @rollup/plugin-node-resolve -D -W
```

### 配置文件

项目根目录创建 rollup.config.js

```js
import fs from 'fs'
import path from 'path'
import json from '@rollup/plugin-json'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const isDev = process.env.NODE_ENV !== 'production'

// 公共插件配置
const plugins = [
  vue({
    // Dynamically inject css as a <style> tag
    css: true,
    // Explicitly convert template to render function
    compileTemplate: true,
  }),
  json(),
  nodeResolve(),
  postcss({
    // 把 css 插入到 style 中
    // inject: true,
    // 把 css 放到和js同一目录
    extract: true,
  }),
]

// 如果不是开发环境，开启压缩
isDev || plugins.push(terser())

// packages 文件夹路径
const root = path.resolve(__dirname, 'packages')

module.exports = fs
  .readdirSync(root)
  // 过滤，只保留文件夹
  .filter((item) => fs.statSync(path.resolve(root, item)).isDirectory())
  // 为每一个文件夹创建对应的配置
  .map((item) => {
    const pkg = require(path.resolve(root, item, 'package.json'))
    return {
      input: path.resolve(root, item, 'index.js'),
      output: [
        {
          exports: 'auto',
          file: path.resolve(root, item, pkg.main),
          format: 'cjs',
        },
        {
          exports: 'auto',
          file: path.join(root, item, pkg.module),
          format: 'es',
        },
      ],
      plugins: plugins,
    }
  })
```

### 在每一个包中设置 package.json 中的 main 和 module 字段

```js
"main": "dist/cjs/index.js",
"module": "dist/es/index.js"
```

### 根目录的 package.json 中配置 scripts

```js
"build": "rollup -c"
```

### 配置环境变量

安装包
-D 开发依赖 -W 工作区根目录
yarn add cross-env -D -W

根目录 package.json 配置

```js
"build:prod": "cross-env NODE_ENV=production rollup -c",
"build:dev": "cross-env NODE_ENV=development rollup -c"
```

运行 对比

yarn build:prod

yarn build:dev

### 清理 node_modules

根目录的 package.json 中配置 scripts

```js
 "clean": "lerna clean"
```

### 清理指定的包 dist

- 安装

```bash
yarn add rimraf -D -W
```

- 给每个包 package.json scripts 配置

```js
"del": "rimraf dist"
```

- 清除运行

```bash
yarn workspaces run del
```

### 基于模版生成组件基本结构

yarn add plop -W -D

- 写模版
