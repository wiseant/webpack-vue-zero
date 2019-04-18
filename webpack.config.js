const path = require('path');
// 插件都是一个类，所以我们命名的时候尽量用大写开头
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // 入口文件
  entry: {
    app: './src/index.js'
  },
  // 输出到dist文件夹, 文件名字为bundle.js，打包模式为UMD
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  // 配置开发服务器使用的端口及目录
  devServer: {
    port: 3000,
    open: true, //自动打开浏览器
    contentBase: './dist',
    historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' //要使用Vue.compile()的话，就必须使用vue的独立构建
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/, //排除 node_modules 文件夹
        options: {
          extractCSS: true // 提取.vue文件中的style作为单个css文件
        }
      },
      {
        test: '/\.js$/', //被 test 匹配的文件都会被 babel 转译
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['env'] //作为参数传入 babel-loader，babel-loader会根据浏览器的不同，自动编译成 es5 或者es6 语法
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(), //打包前先清空目标文件夹中所有文件
    // 复制Html文件
    new HtmlWebpackPlugin({
      template: './public/index.html', // 用src/index.html作为模板
      hash: true, // 会在打包好的bundle.js后面加上hash串
    })
  ]
}