import Vue from 'vue'
import Element from 'element-ui'
import Router from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import ImgList from '@/components/ImgList'
import ImgProcess from '@/components/ImgProcess'

Vue.use(Router)
Vue.use(Element)

export default new Router({
  routes: [
    {
      path: '/ImgList',
      name: 'ImgList',
      component: ImgList
    },
    {
      path: '/ImgProcess',
      name: 'ImgProcess',
      component: ImgProcess
    }
  ],

  mode: 'history'
})
