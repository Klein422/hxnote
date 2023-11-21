import Vue from 'vue'
import Router from 'vue-router'
import Homepage from "../view/Homepage";
import Notebook from "../view/notebook/Notebook";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage
    },
    {
      path: '/notebook',
      name: 'Notebook',
      component: Notebook
    }
  ]
})
