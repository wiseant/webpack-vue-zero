import Vue from 'vue'
import Foo from './components/Foo.vue'
//let Foo = Vue.compile('<div>用字符串模板创建的Vue组件</div>') //恢复此行代码并注释掉上面一行可见到效果

new Vue({
  render: h => h(Foo),
}).$mount('#root')
