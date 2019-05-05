// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import axios from 'axios'
import './assets/scss/style.scss'
import {store} from './store'
Vue.use(Vuetify)
import router from './router'
import '@/firebase/';


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isAuthenticated) {
      next({
        name: 'LoginPage'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresVisitor)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.getters.isAuthenticated) {
      next({
        name: 'DashboardPage'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

new Vue({
  store:store,
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
