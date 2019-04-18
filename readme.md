# webpack4从零开始搭建简单的Vue开发环境
0. 环境
      + webpack 4.x
      + vue 2.6.x

1. 初始化项目
   `npm init -y`

2. 安装`webpack`及`webpack-dev-server`
   `npm i webpack webpack-cli webpack-dev-server -D`

3. 编辑`package.json`文件, 在`scripts`里面加入`"dev"`和`"build"`
       ```js
         "scripts": {
           "dev": "webpack-dev-server --open",
           "build": "webpack --mode production"
         }
       ```

4. 新建`src`目录然后在里面新建`index.js`文件，随便写句`console.log('Hi')`之类

   此时执行`npx webpack --mode development`，会在`dist`目录中生成代码。

5. 新建`public`目录，然后创建`index.html`文件，在body标签中增加`<div id="root"></div>`

6. 安装`html-webpack-plugin`，用于打包时将`html`文件复制到目标文件夹
   `npm i html-webpack-plugin -D`

7. 安装`clean-webpack-plugin`插件，用于在打包前清空目标文件夹
      `npm i clean-webpack-plugin -D`

8. 编写`webpack.config.js`

   *内容参照后面最终版本的`webpack.config.js`文件，删除vue相关设置即可，不再赘述*

   此时执行`npx webpack --mode development`，会在`dist`目录中生成`index.html`及`bundle.js`

9. 并非所有浏览器都支持ES6+语法，所以需要安装`babel`来转译
   `npm install babel-loader @babel/core @babel/preset-env -D`

10. 在根目录下新建`.babelrc`文件

   ```json
   {
     "presets": ["@babel/preset-env"]
   }
   ```

11. 在`webpack.config.js`中添加配置

    ```js
      module: {
        rules: [
          {
            test: '/\.js$/', //被 test 匹配的文件都会被 babel 转译
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              presets: ['env']//作为参数传入babel-loader，根据浏览器的不同，自动编译成es5或es6语法
            }
          }
        ]
      }
    ```

12. 安装`vue`， `npm i vue -S` 或 `npm i vue vue-router -S` (加路由)

13. 安装vue-loader和模板编译器，`npm i vue-loader vue-template-compiler -D`

14. 新建一个简单的Vue组件`src/components/Foo.vue`

    ```vue
    <template>
      <div>
        <input type="text" v-model="message">
        <button @click="handleClick">click me!</button>
      </div>
    </template>
    
    <script>
    export default {
      name: 'Foo',
      props: {
        msg: String
      },
      data() {
        return {
          message: this.msg
        }
      },
      methods: {
        handleClick() {
          alert(this.message);
        }
      }
    }
    </script>
    ```

15. 修改`src/index.js`

    ```js
    import Vue from 'vue'
    import Foo from './components/Foo.vue'
    //let Foo = Vue.compile('<div>用字符串模板创建的Vue组件</div>') //恢复此行代码并注释掉上面一行可见到效果
    
    new Vue({
      render: h => h(Foo),
    }).$mount('#root')
    ```

16. 在`webpack.config.js`中配置vue-loader，最终版本的文件内容如下：

    ```js
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
              presets: ['env']//作为参数传入babel-loader，根据浏览器的不同，自动编译成es5或es6语法
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
    ```

17. 在终端执行`npm run build`进行打包，执行`npm run dev`进行开发测试

参考：
[从零开始基于Vue的Webpack4及babel7配置](https://juejin.im/post/5c70c7da6fb9a049c15fd5a6)

