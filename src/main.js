// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Router from 'vue-router'
import router from './router'
import App from './App'
import Axios from 'axios'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(ElementUI)
// 设置全局的axios
Vue.prototype.$axios = Axios
// 设置基本路径
Axios.defaults.baseURL = '/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
